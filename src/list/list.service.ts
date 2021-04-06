import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './list.entity';
import { Create, Updata, List as ListDTO } from './dto/list.dto'

@Injectable()
export class ListService {
    constructor(
        @InjectRepository(List)
        private listRepository: Repository<List>,
    ) { }
    getAll() {
        return this.listRepository.find();
    }

    getById(id) {
        return this.listRepository.findOne({id});
    }
    
    createList(newList: Create): Promise<ListDTO> {
        return this.listRepository.save(newList);
    }
    
    updataList(id, newList: Updata) {
        return this.listRepository.update(id, newList);
    }

    deleteList(id) {
        return this.listRepository.delete({id});

    }

}
