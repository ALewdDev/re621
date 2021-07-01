import { APITagImplication } from '../api/responses/APITagImplication';
import { Util } from '../utility/Util';
import { E621 } from '../api/E621';

const { localStorage } = window;

const
  dataKey = 're621.dnpcache.data',
  updateKey = 're621.dnpcache.update';


/*
    <string> : Query From Page
*/

const queryFrom = (page: number) => ({
  search: { consequent_name: [ 'avoid_posting' , 'conditional_dnp' ] },
  limit: 320 , page
});


/*
    <async> <APITagImplication[]> : Request Implications
*/

const requestImplications = async (page: number) =>
  E621.TagImplications.get<APITagImplication>(queryFrom(page),500);


export class AvoidPosting {

  private static cache: Set<string>;


  /*
      <Set<string>> : Get Cache

      Read cache data.
  */

  private static getCache() : Set<string> {
    AvoidPosting.cache ??= new Set<string>(JSON.parse(localStorage.getItem(dataKey) ?? '[]'));
    return AvoidPosting.cache;
  }


  /*
      <void> : Save

      Save cache data.
  */

  private static save() : void {
    const cache = AvoidPosting.getCache();
    const json = JSON.stringify(Array.from(cache));

    localStorage.setItem(dataKey,json);
  }


  /*
      <void> : Clear

      Remove cache data.
  */

  private static clear() : void {
    AvoidPosting.cache = new Set();
    AvoidPosting.save();
  }


  /*
      <number> : Size

      Items in cache.
  */

  public static size() : number {
    return AvoidPosting.getCache().size;
  }


  /*
      <bool> : Has

      Has tag in cache.
  */

  public static has(tag: string) : boolean {
    return AvoidPosting
      .getCache()
      .has(tag);
  }


  /*
      <void> : Add

      Add tag to cache.
  */

  private static add(...tags: string[]) : void {
    const cache = AvoidPosting.getCache();
    tags.forEach((tag) => cache.add(tag));
    AvoidPosting.save();
  }


  /*
      <number> : Get Update Time

      Timestamp of the last update.
  */

  public static getUpdateTime() : number {
    return parseInt(localStorage.getItem(updateKey)) ?? 0;
  }


  /*
      <boolean> : Is Update Required

      Check if the cache is outdated.
  */

  public static isUpdateRequired() : boolean {
    if(AvoidPosting.size() === 0)
      return true;

    return Util.Time.now() > (AvoidPosting.getUpdateTime() + Util.Time.DAY);
  }


  /**
      <Promise<number>> : Update

      Updates cache by fetching all tags aliased with 'avoid_posting'

      @param status Element for the status msg
  */

  public static async update(status?: JQuery<HTMLElement>) : Promise<number> {

    status ||= $('<span>');

    AvoidPosting.clear();

    let
      page = 0,
      result: APITagImplication[] = [];

    do {
      status.html(`<i class="fas fa-circle-notch fa-spin"></i> Processing tags: batch ${ page++ } / ?`);
      result = await requestImplications(page);

      const tags = result.map((entry) => entry.antecedent_name);

      AvoidPosting.add(...tags);
    } while (result.length === 320);

    const entries = AvoidPosting.size();

    status.html(`<i class="far fa-check-circle"></i> Cache reloaded: ${ entries } entries`);

    localStorage.setItem(updateKey,String(Util.Time.now()));

    return Promise.resolve(entries);
  }
}
