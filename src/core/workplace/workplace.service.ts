import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenericService } from 'src/common/generic.service';
import { Workplace, WorkplaceDocument } from './entities/workplace.entity';
import { Model } from 'mongoose';

@Injectable()
export class WorkplaceService extends GenericService<
  Workplace,
  WorkplaceDocument
> {
  constructor(
    @InjectModel(Workplace.name) readonly model: Model<WorkplaceDocument>,
  ) {
    super(model);
  }
}
