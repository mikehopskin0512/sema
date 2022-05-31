import { getAll } from "../state/utils/api";

const checkAvailableUrl = async (organizationUrl, token) => {
    const { data } = await getAll(
        `/api/proxy/organizations/check-url/${organizationUrl}`,
        {},
        token
    );
  return data;
};

export default checkAvailableUrl;
