import privateClient from '../client/private.client.js';
import publicClient from '../client/public.client';

const favoriteEndpoints = {
  list: 'user/favorites',
  user: 'user/favorites',
  remove: ({ favoriteId }) => `user/favorites/${favoriteId}`,
};

const favoriteApi = {
  getList: async () => {
    try {
      const response = await privateClient.get(favoriteEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  add: async ({ mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }) => {
    try {
      const response = await privateClient.post(favoriteEndpoints.add, {
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        mediaRate,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async ({ favoriteId }) => {
    try {
      const response = await privateClient.delete(favoriteEndpoints.remove({ favoriteId }));
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default favoriteApi;
