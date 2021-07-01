/* Type definitions for the Danbooru Javascript methods */

import { XM } from './XM';


const stub = () : void => {};


const dummyEvent = () =>
  new CustomEvent('re621.dummy-event');


/*
    <any> : Get Modules
*/

const getModules = () =>
  XM.Window['Danbooru'];


/*
    <bool> : Has Modules
*/

const hasModules = () =>
  getModules() !== undefined;


/*
    <void> : Request
*/

const request = (module: string,method: string,data?: any) =>
  XM.Chrome.execInjectorRequest('Danbooru',module,method,data);


/*
    <void> : Execute
*/

const execute = (module: string,method: string | string[],data?: any[]) : void => {
  if(!Array.isArray(method))
    method = [ method , method ];

  const [ direct , indirect  ] = method;

  if(hasModules())
    getModules()[module][direct](...data);
  else
    request(module,indirect,data);
};




export class Danbooru {


  public static Autocomplete = {
    initialize_all() : void {
      execute('Autocomplete','initialize_all');
    }
  };

  public static Blacklist = {
    apply() : void {
      execute('Blacklist','apply');
    },
    initialize_anonymous_blacklist() : void {
      execute('Blacklist','initialize_anonymous_blacklist');
    },
    initialize_all() : void {
      execute('Blacklist','initialize_all');
    },
    initialize_disable_all_blacklists() : void {
      execute('Blacklist','initialize_disable_all_blacklists');
    },
    stub_vanilla_functions() : void {
      if(hasModules()){
        const module = getModules()['Blacklist'];

        module.initialize_disable_all_blacklists =
        module.initialize_all =
        module.apply =
        stub;

      } else {
        request('Danbooru','Blacklist','stub_vanilla_functions');
      }
    }
  };

  public static Post = {

    vote(post_id: number,score_delta: number,prevent_upvote?: boolean) : void {
      execute('Post','vote',[ post_id , score_delta , prevent_upvote ]);
    },

    initialize_all() : void {
      execute('Post',['update','initialize_all']);
    },

    update(post_id: number,parameter: any) : void{
      execute('Post','update',[ post_id , parameter ]);
    },

    delete_with_reason(post_id: number,reason: string,reload: boolean) : void {
      execute('Post','delete_with_reason',[ post_id , reason , reload ]);
    },

    undelete(post_id: number) : void {
      execute('Post','undelete',[ post_id ]);
    },

    approve(post_id: number,reload: boolean) : void {
      execute('Post','approve',[ post_id , reload ?? false ]);
    },

    disapprove(post_id: number,reason: string,reload: boolean) : void {
      execute('Post','disapprove',[ post_id , reason , reload ]);
    },

    unapprove(post_id: number) : void {
      execute('Post','unapprove',[ post_id ]);
    },

    resize_cycle_mode() : void {
      execute('Post','resize_cycle_mode');
    },

    resize_to(size: string) : void {
      execute('Post','resize_to'[ size ]);
    },

    resize_to_internal(size: string) : void {
      execute('Post','resize_to_internal',[ size ]);
    }
  };

  public static PostModeMenu = {

    change() : void {
      execute('PostModeMenu','change');
    },

    click(event: Event | any) : void {
      execute('PostModeMenu','click',[ event ]);
    },

    change_tag_script(script: number) : void {
      if(hasModules()){
        const event = new CustomEvent('re621.dummy-event');
        event['key'] = script;
        getModules()['PostModeMenu'].change_tag_script(event);
      } else {
        request('PostModeMenu','click',[ script ]);
      }
    }
  };

  public static Note = {
    Box: {
      scale_all() : void {
        if(hasModules()){
          getModules()['PostModeMenu']?.Note?.Box.scale_all();
        } else {
          request('Note.Box','scale_all');
        }
      }
    },
    TranslationMode: {
      active(state?: boolean) : Promise<boolean> {
        if(hasModules()){
          const module = getModules()['Note'];

          if(state !== undefined)
            module.TranslationMode.active = state;
          else
            return Promise.resolve(module.TranslationMode.active);
        } else {
          request('Note.TranslationMode','active',[ state ]);
        }
      },
      toggle() : void {
        if(hasModules()){
          getModules()?.Note.TranslationMode.toggle(dummyEvent());
        } else {
          request('Note.TranslationMode','toggle');
        }
      }
    }
  };

  public static Thumbnails = {
    initialize() : void {
      execute('Thumbnails','initialize');
    }
  };

  public static Utility = {
    disableShortcuts(state?: boolean) : Promise<boolean> {
      if(hasModules()){
        const module = getModules()['Utility'];

        if(state !== undefined)
          module.disableShortcuts.active = state;
        else
          return Promise.resolve(module.disableShortcuts.active);
      } else {
        request('Utility','disableShortcuts',[ state ]);
      }
    }
  };

  public static E621 = {
    addDeferredPosts(posts: []) : void {
      if(hasModules()){
        const { Window } = XM;
        Window['___deferred_posts'] = $.extend(Window['___deferred_posts'] ?? {},posts);
      } else {
        request('E621','addDeferredPosts',[ posts ]);
      }
    }
  };


  public static notice(input: string,permanent?: boolean) : void {
    if(hasModules()){
      getModules()['notice'](input,permanent);
    } else {
      request('Notice','notice',[ input , permanent ]);
    }
  }

  public static error(input: string) : void {
    if(hasModules()){
      getModules()['error'](input);
    } else {
      request('Notice','error',[ input ]);
    }
  }
}
