import { getAll } from "../state/utils/api";

const checkAvailableUrl = async (teamUrl, token) => {
    const { data } = await getAll(
        `/api/proxy/teams/check-url/${teamUrl}`,
        {},
        token
    );
  return data;
};

export default checkAvailableUrl;