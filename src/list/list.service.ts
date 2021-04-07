import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './list.entity';
import { CreateWithUserDTO, UpdataDTO, ListDTO } from './dto/list.dto'

@Injectable()
export class ListService {
    constructor(
        @InjectRepository(List)
        private listRepository: Repository<List>,
    ) { }
    getAll() {
        return this.listRepository.find();
    }
    getAllByUserId(userId) {
        return this.listRepository.find({user: userId});
    }

    getById(id: number) {
        return this.listRepository.findOne({id});
    }
    
    createList(newList: CreateWithUserDTO): Promise<ListDTO> {
        return this.listRepository.save(newList);
    }
    
    updataList(id: number, newList: UpdataDTO) {
        return this.listRepository.update(id, newList);
    }

    async updataListByUserId(id: number, newList: UpdataDTO, user:number) {
        await this.checkUser(id, user);
        return this.listRepository.update({id, user}, newList);
    }


    deleteList(id: number) {
        return this.listRepository.delete({id});
    }
    
    async deleteListByUserId(id: number, user: number) {
        await this.checkUser(id, user);
        return this.listRepository.delete({id , user});
    }

    private async checkUser(id, user) {
        const data = await this.listRepository.find({id, user});
        if(data.length === 0) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'List id not valid',
            }, HttpStatus.FORBIDDEN);
        }
    }
}
