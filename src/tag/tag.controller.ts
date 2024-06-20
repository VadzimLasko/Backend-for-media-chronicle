import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagEntity } from './tag.entity';

@Controller('tags') // То что сюда поставишь потом будет добавлятся ко всем запросам от этого контроллера c добавлением /, типа url/tags
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get() // 1)если сюда поставишь, то только к этому дейтвию потом будет добавлятся 2) Тут указывается тип запроса которыый сюда поступает, т.е. Get
  async findAll(): Promise<{ tags: string[] }> {
    // название функции может быть любым
    const tags = await this.tagService.findAll();
    return { tags: tags.map((tag) => tag.name) };
  }
}
