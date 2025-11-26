import { test as base, request, expect as baseExpect } from '@playwright/test';
import { DogListAll } from '../services/list-all/dog.list';
import { RandomImage } from '../services/random-image/random.image';
import { API_BASE_URL } from '../utils/constants';

type TestFixtures = {
  listAll: DogListAll;
  randomImage: RandomImage;
};

export const test = base.extend<TestFixtures>({
  listAll: async ({}, use): Promise<void> => {
    const apiRequest = await request.newContext({
      baseURL: API_BASE_URL,
    });
    const client = new DogListAll(apiRequest);
    await use(client);
    await apiRequest.dispose();
  },
  randomImage: async ({}, use): Promise<void> => {
    const apiRequest = await request.newContext({
      baseURL: API_BASE_URL,
    });
    const client = new RandomImage(apiRequest);
    await use(client);
    await apiRequest.dispose();
  },
});

export { baseExpect as expect };

