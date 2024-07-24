import axios from 'axios';
import { app_env } from '../../environment';

export type SearchSubspecialtiesSemanticallyArgs = {
  search_term: string;
};

export const searchSubspecialtiesSemantically = async (
  args: SearchSubspecialtiesSemanticallyArgs,
) => {
  try {
    const { search_term } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/search-subspecialties/`,
      data: {
        search_term,
      },
    });

    return response.data.results;
  } catch (error) {
    throw error;
  }
};

const sourcererLiteService = {
  searchSubspecialtiesSemantically,
};

export default sourcererLiteService;
