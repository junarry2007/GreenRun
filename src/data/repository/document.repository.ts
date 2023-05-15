import { AppDataSource } from "../data.source";
import { DocumentEntity } from "../entities/document.entity";

export class DocumentRepository {

    static getAll(): Promise<DocumentEntity[]> {
        return AppDataSource.manager.find(DocumentEntity);
    }

    static getById(id: number): Promise<DocumentEntity | null> {
        return AppDataSource.getRepository(DocumentEntity).findOneBy({
            id: id
        });
    }

}