import { RequestEbookApiDownload } from '@/application/use-cases/ebook/request-ebook-api-download';
import { EbooksRepository } from '@/infrastructure/repositories/ebooks.repository';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { SupabaseStorageService } from '@/infrastructure/services/storage.service';
import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ slug: string }> }
) {
  const { slug } = await params;

  const useCase = new RequestEbookApiDownload(
    new ProductsRepository(),
    new EbooksRepository(),
    new SupabaseStorageService()
  );

  const url = await useCase.execute(slug);

  return NextResponse.redirect(url);
}
