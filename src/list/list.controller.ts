import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { Create, Updata, List } from './dto/list.dto'

@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService){}

    @Get('')
    getAll() {
        return this.listService.getAll();
    }
    
    @Get(':id')
    getById(@Param() params){
        return this.listService.getById(params.id);
    }

    @Put(':id')
    updataList(@Param() params, @Body() updataList: Updata) {
        return this.listService.updataList(params.id, updataList);
    }

    @Post('')
    createList(@Body() newList: Create): Promise<List> {
        return this.listService.createList(newList);
    }

    @Delete(':id')
    deleteList(@Param() param) {
        return this.listService.deleteList(param.id);
    }


}
