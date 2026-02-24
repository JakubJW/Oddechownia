'use server';

import { getUser } from './user';
import { RequestEbookDownload } from '@/application/use-cases/ebook/request-ebook.download';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { EbooksRepository } from '@/infrastructure/repositories/ebooks.repository';
import { SupabaseStorageService } from '@/infrastructure/services/storage.service';

export async function downloadEbook(productId: string) {
  const user = await getUser();

  const useCase = new RequestEbookDownload(
    new ProductsRepository(),
    new PurchasesRepository(),
    new EbooksRepository(),
    new SupabaseStorageService()
  );

  const url = await useCase.execute(productId, user?.id);

  return url;
}
