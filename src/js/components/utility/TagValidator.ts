
const categories = [ 'general' , 'species' , 'character' , 'copyright' , 'artist' , 'invalid' , 'lore' , 'meta' ];

const metatags = [
  'user' , 'approver' , 'commenter' , 'comm' , 'noter' , 'noteupdater' ,
  'artcomm?' , 'pool' , 'ordpool' , 'fav' , 'favoritedby' , 'md5' , 'rating' ,
  'note' , 'locked' , 'width' , 'height' , 'mpixels' , 'ratio' , 'score' ,
  'favcount' , 'filesize' , 'source' , 'id' , 'date' , 'age' , 'order' ,
  'limit' , 'status' , 'tagcount' , 'parent' , 'child' , 'pixiv_id' , 'pixiv' ,
  'search' , 'upvote' , 'downvote' , 'voted' , 'filetype' , 'flagger' , 'type' ,
  'appealer' , 'disapproval' , 'set' , 'randseed' , 'description' , 'change' ,
  'user_id' , 'delreason' , 'deletedby' , 'votedup' , 'voteddown' , 'duration'
];

const makeRegex = (items: string[]) =>
  new RegExp(`^(${ items.join('|') }):(.+)$`,'i');

const
  meta_regex = makeRegex(metatags),
  category_regex = makeRegex(categories);

const validation = [{
  regex: /\*/,
  text: `Tags cannot contain asterisks ('*')`
},{
  regex: /,/,
  text: `Tags cannot contain commas (',')`
},{
  regex: /#/,
  text: `Tags cannot contain octothorpes ('#')`
},{
  regex: /\$/,
  text: `Tags cannot contain peso signs ('$')`
},{
  regex: /%/,
  text: `Tags cannot contain percent signs ('%')`
},{
  regex: /\\/,
  text: `Tags cannot contain back slashes ('\\')`
},{
  regex: /[_\-~]{2}/,
  text: `Tags cannot contain consecutive underscores, hyphens or tildes`
},{
  regex: /[\x00-\x1F]/,
  text: `Tags cannot contain non-printable characters`
},{
  regex: /^([-~+:_`(){}\[\]\/])/,
  text: `Tags cannot begin with %MATCHNAME% ('%MATCH%')`
},{
  regex: /([_])$/,
  text: `Tags cannot end with %MATCHNAME% ('%MATCH%')`
},{
  regex: /&/,
  text: `Tags containing ampersands ('&') should be avoided`
},{
  regex: meta_regex,
  text: `Tags cannot begin with '%MATCH%:'`
},{
  regex: category_regex,
  text: `Tags cannot begin with '%MATCH%:'`
}];

const charnames = {
  '-': 'a dash',
  '~': 'a tiled',
  '+': 'a plus sign',
  ':': 'a colon',
  '_': 'an underscore',
  '`': 'a backtick',
  '(': 'a bracket',
  ')': 'a bracket',
  '{': 'a brace',
  '}': 'a brace',
  '[': 'a square bracket',
  ']': 'a square bracket',
  '/': 'a slash'
};


export default class {

  /*
      <bool> : Run

      Check if the tag is valid.
  */

  public static run(tag: string) : boolean {
    return this.runVerbose(tag).length === 0;
  }


  /*
      <string[]> : Run Verbose

      Check a tag for errors.
  */

  public static runVerbose(tag: string) : string[] {
    const errors = [];

    if(tag.length < 1)
      return;

    if([...tag].some((char) => char.charCodeAt(0) > 127))
      errors.push(`Tags can only contain ASCII characters`);

    if(/[ \n\r\t]+/.test(tag))
      errors.push(`Tags cannot contain spaces, tabs or newlines`);

    for(const { text , regex } of validation){
      const match = tag.match(regex);

      if(match)
        errors.push(
          text
          .replace('%MATCHNAME%',charnames[match[1]])
          .replace('%MATCH%',match[1])
        );
    }

    return errors;
  }
}
