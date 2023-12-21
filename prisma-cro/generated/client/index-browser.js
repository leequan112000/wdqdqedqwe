
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.1.1
 * Query Engine version: 6a3747c37ff169c90047725a05a6ef02e32ac97e
 */
Prisma.prismaVersion = {
  client: "5.1.1",
  engine: "6a3747c37ff169c90047725a05a6ef02e32ac97e"
}


const runtimeDescription = (() => {
  // https://edge-runtime.vercel.app/features/available-apis#addressing-the-runtime
  if ("EdgeRuntime" in globalThis && typeof globalThis.EdgeRuntime === "string") {
    return "under the Vercel Edge Runtime";
  }
  // Deno
  if ("Deno" in globalThis && typeof globalThis.Deno === "object") {
    return "under the Deno runtime";
  }
  // Default to assuming browser
  return "in the browser";
})();


Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Vendor_companiesScalarFieldEnum = {
  id: 'id',
  company_name: 'company_name',
  website_url: 'website_url',
  linkedin_url: 'linkedin_url',
  type: 'type',
  is_active: 'is_active',
  is_cromatic_vendor: 'is_cromatic_vendor'
};

exports.Prisma.Traffic_infoScalarFieldEnum = {
  id: 'id',
  company_id: 'company_id',
  last_updated: 'last_updated',
  display_date: 'display_date',
  rank: 'rank',
  visits: 'visits',
  users: 'users',
  search_organic: 'search_organic',
  search_paid: 'search_paid',
  social_organic: 'social_organic',
  social_paid: 'social_paid',
  referral: 'referral',
  time_on_site: 'time_on_site',
  pages_per_visit: 'pages_per_visit',
  bounce_rate: 'bounce_rate',
  categories: 'categories'
};

exports.Prisma.Linkedin_infoScalarFieldEnum = {
  id: 'id',
  company_id: 'company_id',
  last_updated: 'last_updated',
  company_size: 'company_size',
  industry: 'industry',
  description: 'description',
  linkedin_followers: 'linkedin_followers',
  founded: 'founded',
  created: 'created',
  li_last_updated: 'li_last_updated',
  type: 'type',
  employees_count: 'employees_count'
};

exports.Prisma.Company_specialtiesScalarFieldEnum = {
  id: 'id',
  linkedin_info_id: 'linkedin_info_id',
  specialty: 'specialty'
};

exports.Prisma.Featured_employeesScalarFieldEnum = {
  id: 'id',
  linkedin_info_id: 'linkedin_info_id',
  linkedin_url: 'linkedin_url'
};

exports.Prisma.LocationsScalarFieldEnum = {
  id: 'id',
  linkedin_info_id: 'linkedin_info_id',
  location_address: 'location_address'
};

exports.Prisma.Funding_infoScalarFieldEnum = {
  id: 'id',
  company_id: 'company_id',
  last_updated: 'last_updated',
  company_img_url: 'company_img_url',
  company_type: 'company_type',
  ipo_status: 'ipo_status',
  revenue_range: 'revenue_range',
  org_rank: 'org_rank',
  num_articles: 'num_articles'
};

exports.Prisma.CategoriesScalarFieldEnum = {
  id: 'id',
  category_id: 'category_id',
  funding_info_id: 'funding_info_id',
  category: 'category'
};

exports.Prisma.Press_referencesScalarFieldEnum = {
  id: 'id',
  press_id: 'press_id',
  funding_info_id: 'funding_info_id',
  author: 'author',
  title: 'title',
  publisher: 'publisher',
  url: 'url',
  posted_on: 'posted_on'
};

exports.Prisma.Funding_roundsScalarFieldEnum = {
  id: 'id',
  round_id: 'round_id',
  funding_info_id: 'funding_info_id',
  is_equity: 'is_equity',
  investment_stage: 'investment_stage',
  short_description: 'short_description',
  currency: 'currency',
  money_raised: 'money_raised',
  announced_on: 'announced_on'
};

exports.Prisma.FoundersScalarFieldEnum = {
  id: 'id',
  founder_id: 'founder_id',
  funding_info_id: 'funding_info_id',
  full_name: 'full_name',
  primary_job_title: 'primary_job_title',
  description: 'description',
  linkedin: 'linkedin',
  num_founded_organizations: 'num_founded_organizations',
  rank_person: 'rank_person'
};

exports.Prisma.Website_infoScalarFieldEnum = {
  id: 'id',
  company_id: 'company_id',
  last_updated: 'last_updated'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};


exports.Prisma.ModelName = {
  vendor_companies: 'vendor_companies',
  traffic_info: 'traffic_info',
  linkedin_info: 'linkedin_info',
  company_specialties: 'company_specialties',
  featured_employees: 'featured_employees',
  locations: 'locations',
  funding_info: 'funding_info',
  categories: 'categories',
  press_references: 'press_references',
  funding_rounds: 'funding_rounds',
  founders: 'founders',
  website_info: 'website_info'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
