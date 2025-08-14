import axios from "axios";

type ImportOpts = {
  apiKey: string;
  collectionName: string;
  workspaceId?: string;
};

export async function importOrUpdateCollection(
  collectionJson: any,
  opts: ImportOpts
): Promise<void> {
  const { apiKey, collectionName, workspaceId } = opts;

  if (!apiKey) {
    throw new Error("POSTMAN_API_KEY is not set.");
  }

  const client = axios.create({
    baseURL: "https://api.getpostman.com",
    headers: { "X-Api-Key": apiKey }
  });

  async function ensureWorkspace(client: import("axios").AxiosInstance, providedId: string | undefined, desiredName: string) {
    if (providedId) {
      try {
        const resp = await client.get(`/workspaces/${providedId}`);
        const id = resp?.data?.workspace?.id;
        if (id) return id;
      } catch (err: any) {
        if (isForbiddenError(err)) {
          console.warn(
            `⚠️  Provided workspaceId=${providedId} is not accessible. A new workspace will be created.`
          );
        } else {
          console.warn(
            `⚠️  Could not verify provided workspaceId=${providedId}. A new workspace will be created.`
          );
        }
      }
    }

    try {
      const list = await client.get(`/workspaces`);
      const all = list?.data?.workspaces ?? [];
      const existing = all.find((w: any) => w?.name === desiredName);
      if (existing?.id) {
        console.log(`▶️  Using existing workspace: ${desiredName} (${existing.id})`);
        return existing.id;
      }
    } catch (err: any) {
    }

    try {
      const createResp = await client.post(`/workspaces`, {
        workspace: { name: desiredName, type: "personal" }
      });
      const newId = createResp?.data?.workspace?.id;
      if (newId) {
        console.log(`✅ Created workspace: ${desiredName} (${newId})`);
        return newId;
      }
    } catch (err: any) {
      console.warn(
        `⚠️  Failed to create workspace '${desiredName}'. Will fall back to default workspace.`,
      );
    }

    return undefined;
  }

  const workspaceQueryForId = (id?: string) => (id ? `?workspace=${id}` : "");

  function isForbiddenError(err: any): boolean {
    const status = err?.response?.status;
    const name = err?.response?.data?.error?.name;
    return (status === 400 || status === 403) && name === "forbiddenError";
  }

  try {
    const desiredWorkspaceName = `${collectionName} Workspace`;
    const targetWorkspaceId = await ensureWorkspace(client, workspaceId, desiredWorkspaceName);

    let listResp;
    try {
      listResp = await client.get(`/collections${workspaceQueryForId(targetWorkspaceId)}`);
    } catch (err: any) {
      if (targetWorkspaceId && isForbiddenError(err)) {
        console.warn(
          `⚠️  Workspace not accessible (workspaceId=${targetWorkspaceId}). Retrying without workspace parameter...`
        );
        listResp = await client.get(`/collections`);
      } else {
        throw err;
      }
    }
    const collections = listResp.data?.collections ?? [];
    const existing = collections.find((c: any) => c.name === collectionName);

    const payload = {
      collection: {
        ...(collectionJson ?? {}),
        info: {
          ...(collectionJson?.info ?? {}),
          name: collectionName,
          schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        }
      }
    };

    if (existing) {
      const updateResp = await client.put(`/collections/${existing.uid}`, payload);
      const updated = updateResp.data?.collection;
      console.log(`✅ Collection updated: ${updated?.name ?? collectionName}`);
      console.log(`🔗 https://go.postman.co/collections/${updated?.uid}`);
    } else {
      let createResp;
      try {
        createResp = await client.post(`/collections${workspaceQueryForId(targetWorkspaceId)}`, payload);
      } catch (err: any) {
        if (targetWorkspaceId && isForbiddenError(err)) {
          console.warn(
            `⚠️  Cannot create collection in workspaceId=${targetWorkspaceId}. Retrying create in your default workspace...`
          );
          createResp = await client.post(`/collections`, payload);
        } else {
          throw err;
        }
      }
      const created = createResp.data?.collection;
      console.log(`✅ Collection created: ${created?.name ?? collectionName}`);
      console.log(`🔗 https://go.postman.co/collections/${created?.uid}`);
    }
  } catch (err: any) {
    if (err?.response) {
      console.error(
        "❌ Postman API error:",
        JSON.stringify(
          {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          },
          null,
          2
        )
      );
    } else {
      console.error("❌ Import error:", err?.message ?? err);
    }
    throw err;
  }
}
