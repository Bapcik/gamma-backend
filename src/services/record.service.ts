import { RecordDto } from '../dto/record.dto';
import { IRecord } from '../interfaces/IRecord.interface';
import { PsychologistRepository } from '../repositories/psychologist.repository';
import { RecordRepository } from '../repositories/record.repository';
import { ApiError } from '../helpers/api-error';
import { FindOptionsWhere } from 'typeorm';
import { Psychologist } from '../entities/psychologist.entity';

export class RecordService {
  private repository: RecordRepository;
  private repositoryPsycho: PsychologistRepository;

  constructor() {
    this.repository = new RecordRepository();
    this.repositoryPsycho = new PsychologistRepository();
  }

  public createRecord = async (RecordDto: RecordDto) => {
    const psychologist = await this.repositoryPsycho.findOnePsychologist(RecordDto.psychologistId as FindOptionsWhere<Psychologist>);
    RecordDto.cityId = psychologist?.cityId as number;
    RecordDto.cost = psychologist?.cost as number;
    RecordDto.broadcast = 'some link';
    return await this.repository.createRecord(RecordDto);
  };

  public getAllRecords = async (): Promise<IRecord[]> => {
    return await this.repository.getAllRecords();
  };

  public getOneRecord = async (id: number): Promise<IRecord | null> => {
    return await this.repository.getOneRecord(id);
  };

  public cancelRecord = async (Record: IRecord) => {
    const newRecord = await this.getOneRecord(Record.id as number);
    if (newRecord != null) {
      newRecord.isCanceled = true;
      return await this.repository.cancelRecord(Record);
    }
    return ApiError.BadRequest('Нельзя отменить запись');
  };
}
