'use server';

import { getUser } from './user';
import { RequestEbookDownload } from '../use-cases/request-ebook.download';
import { ProductsRepository } from '../products.repository';
import { PurchasesRepository } from '../purchases.repository';
import { EbooksRepository } from '../ebooks.repository';
import { SupabaseStorageService } from '../storage.service';

export async function downloadEbook(slug: string) {
  const user = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const useCase = new RequestEbookDownload(
    new ProductsRepository(),
    new PurchasesRepository(),
    new EbooksRepository(),
    new SupabaseStorageService()
  );

  const url = await useCase.execute(user.id, slug);

  return url;
}

export const purchaseEbook = async (slug: string) => {
  const useCase = new RequestEbookDownload(new ProductsRepository());

  const url = await useCase.execute(slug);

  return url;
};
