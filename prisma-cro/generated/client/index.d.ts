
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model vendor_companies
 * 
 */
export type vendor_companies = $Result.DefaultSelection<Prisma.$vendor_companiesPayload>
/**
 * Model traffic_info
 * 
 */
export type traffic_info = $Result.DefaultSelection<Prisma.$traffic_infoPayload>
/**
 * Model linkedin_info
 * 
 */
export type linkedin_info = $Result.DefaultSelection<Prisma.$linkedin_infoPayload>
/**
 * Model company_specialties
 * 
 */
export type company_specialties = $Result.DefaultSelection<Prisma.$company_specialtiesPayload>
/**
 * Model featured_employees
 * 
 */
export type featured_employees = $Result.DefaultSelection<Prisma.$featured_employeesPayload>
/**
 * Model locations
 * 
 */
export type locations = $Result.DefaultSelection<Prisma.$locationsPayload>
/**
 * Model funding_info
 * 
 */
export type funding_info = $Result.DefaultSelection<Prisma.$funding_infoPayload>
/**
 * Model categories
 * 
 */
export type categories = $Result.DefaultSelection<Prisma.$categoriesPayload>
/**
 * Model press_references
 * 
 */
export type press_references = $Result.DefaultSelection<Prisma.$press_referencesPayload>
/**
 * Model funding_rounds
 * 
 */
export type funding_rounds = $Result.DefaultSelection<Prisma.$funding_roundsPayload>
/**
 * Model founders
 * 
 */
export type founders = $Result.DefaultSelection<Prisma.$foundersPayload>
/**
 * Model website_info
 * 
 */
export type website_info = $Result.DefaultSelection<Prisma.$website_infoPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Vendor_companies
 * const vendor_companies = await prisma.vendor_companies.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Vendor_companies
   * const vendor_companies = await prisma.vendor_companies.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.vendor_companies`: Exposes CRUD operations for the **vendor_companies** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendor_companies
    * const vendor_companies = await prisma.vendor_companies.findMany()
    * ```
    */
  get vendor_companies(): Prisma.vendor_companiesDelegate<ExtArgs>;

  /**
   * `prisma.traffic_info`: Exposes CRUD operations for the **traffic_info** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Traffic_infos
    * const traffic_infos = await prisma.traffic_info.findMany()
    * ```
    */
  get traffic_info(): Prisma.traffic_infoDelegate<ExtArgs>;

  /**
   * `prisma.linkedin_info`: Exposes CRUD operations for the **linkedin_info** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Linkedin_infos
    * const linkedin_infos = await prisma.linkedin_info.findMany()
    * ```
    */
  get linkedin_info(): Prisma.linkedin_infoDelegate<ExtArgs>;

  /**
   * `prisma.company_specialties`: Exposes CRUD operations for the **company_specialties** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Company_specialties
    * const company_specialties = await prisma.company_specialties.findMany()
    * ```
    */
  get company_specialties(): Prisma.company_specialtiesDelegate<ExtArgs>;

  /**
   * `prisma.featured_employees`: Exposes CRUD operations for the **featured_employees** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Featured_employees
    * const featured_employees = await prisma.featured_employees.findMany()
    * ```
    */
  get featured_employees(): Prisma.featured_employeesDelegate<ExtArgs>;

  /**
   * `prisma.locations`: Exposes CRUD operations for the **locations** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.locations.findMany()
    * ```
    */
  get locations(): Prisma.locationsDelegate<ExtArgs>;

  /**
   * `prisma.funding_info`: Exposes CRUD operations for the **funding_info** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Funding_infos
    * const funding_infos = await prisma.funding_info.findMany()
    * ```
    */
  get funding_info(): Prisma.funding_infoDelegate<ExtArgs>;

  /**
   * `prisma.categories`: Exposes CRUD operations for the **categories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.categories.findMany()
    * ```
    */
  get categories(): Prisma.categoriesDelegate<ExtArgs>;

  /**
   * `prisma.press_references`: Exposes CRUD operations for the **press_references** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Press_references
    * const press_references = await prisma.press_references.findMany()
    * ```
    */
  get press_references(): Prisma.press_referencesDelegate<ExtArgs>;

  /**
   * `prisma.funding_rounds`: Exposes CRUD operations for the **funding_rounds** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Funding_rounds
    * const funding_rounds = await prisma.funding_rounds.findMany()
    * ```
    */
  get funding_rounds(): Prisma.funding_roundsDelegate<ExtArgs>;

  /**
   * `prisma.founders`: Exposes CRUD operations for the **founders** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Founders
    * const founders = await prisma.founders.findMany()
    * ```
    */
  get founders(): Prisma.foundersDelegate<ExtArgs>;

  /**
   * `prisma.website_info`: Exposes CRUD operations for the **website_info** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Website_infos
    * const website_infos = await prisma.website_info.findMany()
    * ```
    */
  get website_info(): Prisma.website_infoDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.1.1
   * Query Engine version: 6a3747c37ff169c90047725a05a6ef02e32ac97e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'vendor_companies' | 'traffic_info' | 'linkedin_info' | 'company_specialties' | 'featured_employees' | 'locations' | 'funding_info' | 'categories' | 'press_references' | 'funding_rounds' | 'founders' | 'website_info'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      vendor_companies: {
        payload: Prisma.$vendor_companiesPayload<ExtArgs>
        fields: Prisma.vendor_companiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.vendor_companiesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.vendor_companiesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          findFirst: {
            args: Prisma.vendor_companiesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.vendor_companiesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          findMany: {
            args: Prisma.vendor_companiesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>[]
          }
          create: {
            args: Prisma.vendor_companiesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          createMany: {
            args: Prisma.vendor_companiesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.vendor_companiesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          update: {
            args: Prisma.vendor_companiesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          deleteMany: {
            args: Prisma.vendor_companiesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.vendor_companiesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.vendor_companiesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$vendor_companiesPayload>
          }
          aggregate: {
            args: Prisma.Vendor_companiesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateVendor_companies>
          }
          groupBy: {
            args: Prisma.vendor_companiesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Vendor_companiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.vendor_companiesCountArgs<ExtArgs>,
            result: $Utils.Optional<Vendor_companiesCountAggregateOutputType> | number
          }
        }
      }
      traffic_info: {
        payload: Prisma.$traffic_infoPayload<ExtArgs>
        fields: Prisma.traffic_infoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.traffic_infoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.traffic_infoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          findFirst: {
            args: Prisma.traffic_infoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.traffic_infoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          findMany: {
            args: Prisma.traffic_infoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>[]
          }
          create: {
            args: Prisma.traffic_infoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          createMany: {
            args: Prisma.traffic_infoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.traffic_infoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          update: {
            args: Prisma.traffic_infoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          deleteMany: {
            args: Prisma.traffic_infoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.traffic_infoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.traffic_infoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$traffic_infoPayload>
          }
          aggregate: {
            args: Prisma.Traffic_infoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTraffic_info>
          }
          groupBy: {
            args: Prisma.traffic_infoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Traffic_infoGroupByOutputType>[]
          }
          count: {
            args: Prisma.traffic_infoCountArgs<ExtArgs>,
            result: $Utils.Optional<Traffic_infoCountAggregateOutputType> | number
          }
        }
      }
      linkedin_info: {
        payload: Prisma.$linkedin_infoPayload<ExtArgs>
        fields: Prisma.linkedin_infoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.linkedin_infoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.linkedin_infoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          findFirst: {
            args: Prisma.linkedin_infoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.linkedin_infoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          findMany: {
            args: Prisma.linkedin_infoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>[]
          }
          create: {
            args: Prisma.linkedin_infoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          createMany: {
            args: Prisma.linkedin_infoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.linkedin_infoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          update: {
            args: Prisma.linkedin_infoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          deleteMany: {
            args: Prisma.linkedin_infoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.linkedin_infoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.linkedin_infoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$linkedin_infoPayload>
          }
          aggregate: {
            args: Prisma.Linkedin_infoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLinkedin_info>
          }
          groupBy: {
            args: Prisma.linkedin_infoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Linkedin_infoGroupByOutputType>[]
          }
          count: {
            args: Prisma.linkedin_infoCountArgs<ExtArgs>,
            result: $Utils.Optional<Linkedin_infoCountAggregateOutputType> | number
          }
        }
      }
      company_specialties: {
        payload: Prisma.$company_specialtiesPayload<ExtArgs>
        fields: Prisma.company_specialtiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.company_specialtiesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.company_specialtiesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          findFirst: {
            args: Prisma.company_specialtiesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.company_specialtiesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          findMany: {
            args: Prisma.company_specialtiesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>[]
          }
          create: {
            args: Prisma.company_specialtiesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          createMany: {
            args: Prisma.company_specialtiesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.company_specialtiesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          update: {
            args: Prisma.company_specialtiesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          deleteMany: {
            args: Prisma.company_specialtiesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.company_specialtiesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.company_specialtiesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$company_specialtiesPayload>
          }
          aggregate: {
            args: Prisma.Company_specialtiesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCompany_specialties>
          }
          groupBy: {
            args: Prisma.company_specialtiesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Company_specialtiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.company_specialtiesCountArgs<ExtArgs>,
            result: $Utils.Optional<Company_specialtiesCountAggregateOutputType> | number
          }
        }
      }
      featured_employees: {
        payload: Prisma.$featured_employeesPayload<ExtArgs>
        fields: Prisma.featured_employeesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.featured_employeesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.featured_employeesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          findFirst: {
            args: Prisma.featured_employeesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.featured_employeesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          findMany: {
            args: Prisma.featured_employeesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>[]
          }
          create: {
            args: Prisma.featured_employeesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          createMany: {
            args: Prisma.featured_employeesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.featured_employeesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          update: {
            args: Prisma.featured_employeesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          deleteMany: {
            args: Prisma.featured_employeesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.featured_employeesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.featured_employeesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$featured_employeesPayload>
          }
          aggregate: {
            args: Prisma.Featured_employeesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFeatured_employees>
          }
          groupBy: {
            args: Prisma.featured_employeesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Featured_employeesGroupByOutputType>[]
          }
          count: {
            args: Prisma.featured_employeesCountArgs<ExtArgs>,
            result: $Utils.Optional<Featured_employeesCountAggregateOutputType> | number
          }
        }
      }
      locations: {
        payload: Prisma.$locationsPayload<ExtArgs>
        fields: Prisma.locationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.locationsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.locationsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          findFirst: {
            args: Prisma.locationsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.locationsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          findMany: {
            args: Prisma.locationsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>[]
          }
          create: {
            args: Prisma.locationsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          createMany: {
            args: Prisma.locationsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.locationsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          update: {
            args: Prisma.locationsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          deleteMany: {
            args: Prisma.locationsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.locationsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.locationsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$locationsPayload>
          }
          aggregate: {
            args: Prisma.LocationsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLocations>
          }
          groupBy: {
            args: Prisma.locationsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<LocationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.locationsCountArgs<ExtArgs>,
            result: $Utils.Optional<LocationsCountAggregateOutputType> | number
          }
        }
      }
      funding_info: {
        payload: Prisma.$funding_infoPayload<ExtArgs>
        fields: Prisma.funding_infoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.funding_infoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.funding_infoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          findFirst: {
            args: Prisma.funding_infoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.funding_infoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          findMany: {
            args: Prisma.funding_infoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>[]
          }
          create: {
            args: Prisma.funding_infoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          createMany: {
            args: Prisma.funding_infoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.funding_infoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          update: {
            args: Prisma.funding_infoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          deleteMany: {
            args: Prisma.funding_infoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.funding_infoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.funding_infoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_infoPayload>
          }
          aggregate: {
            args: Prisma.Funding_infoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFunding_info>
          }
          groupBy: {
            args: Prisma.funding_infoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Funding_infoGroupByOutputType>[]
          }
          count: {
            args: Prisma.funding_infoCountArgs<ExtArgs>,
            result: $Utils.Optional<Funding_infoCountAggregateOutputType> | number
          }
        }
      }
      categories: {
        payload: Prisma.$categoriesPayload<ExtArgs>
        fields: Prisma.categoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.categoriesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.categoriesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          findFirst: {
            args: Prisma.categoriesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.categoriesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          findMany: {
            args: Prisma.categoriesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>[]
          }
          create: {
            args: Prisma.categoriesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          createMany: {
            args: Prisma.categoriesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.categoriesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          update: {
            args: Prisma.categoriesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          deleteMany: {
            args: Prisma.categoriesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.categoriesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.categoriesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$categoriesPayload>
          }
          aggregate: {
            args: Prisma.CategoriesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCategories>
          }
          groupBy: {
            args: Prisma.categoriesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CategoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.categoriesCountArgs<ExtArgs>,
            result: $Utils.Optional<CategoriesCountAggregateOutputType> | number
          }
        }
      }
      press_references: {
        payload: Prisma.$press_referencesPayload<ExtArgs>
        fields: Prisma.press_referencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.press_referencesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.press_referencesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          findFirst: {
            args: Prisma.press_referencesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.press_referencesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          findMany: {
            args: Prisma.press_referencesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>[]
          }
          create: {
            args: Prisma.press_referencesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          createMany: {
            args: Prisma.press_referencesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.press_referencesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          update: {
            args: Prisma.press_referencesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          deleteMany: {
            args: Prisma.press_referencesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.press_referencesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.press_referencesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$press_referencesPayload>
          }
          aggregate: {
            args: Prisma.Press_referencesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePress_references>
          }
          groupBy: {
            args: Prisma.press_referencesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Press_referencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.press_referencesCountArgs<ExtArgs>,
            result: $Utils.Optional<Press_referencesCountAggregateOutputType> | number
          }
        }
      }
      funding_rounds: {
        payload: Prisma.$funding_roundsPayload<ExtArgs>
        fields: Prisma.funding_roundsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.funding_roundsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.funding_roundsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          findFirst: {
            args: Prisma.funding_roundsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.funding_roundsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          findMany: {
            args: Prisma.funding_roundsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>[]
          }
          create: {
            args: Prisma.funding_roundsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          createMany: {
            args: Prisma.funding_roundsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.funding_roundsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          update: {
            args: Prisma.funding_roundsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          deleteMany: {
            args: Prisma.funding_roundsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.funding_roundsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.funding_roundsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$funding_roundsPayload>
          }
          aggregate: {
            args: Prisma.Funding_roundsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFunding_rounds>
          }
          groupBy: {
            args: Prisma.funding_roundsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Funding_roundsGroupByOutputType>[]
          }
          count: {
            args: Prisma.funding_roundsCountArgs<ExtArgs>,
            result: $Utils.Optional<Funding_roundsCountAggregateOutputType> | number
          }
        }
      }
      founders: {
        payload: Prisma.$foundersPayload<ExtArgs>
        fields: Prisma.foundersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.foundersFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.foundersFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          findFirst: {
            args: Prisma.foundersFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.foundersFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          findMany: {
            args: Prisma.foundersFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>[]
          }
          create: {
            args: Prisma.foundersCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          createMany: {
            args: Prisma.foundersCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.foundersDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          update: {
            args: Prisma.foundersUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          deleteMany: {
            args: Prisma.foundersDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.foundersUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.foundersUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$foundersPayload>
          }
          aggregate: {
            args: Prisma.FoundersAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFounders>
          }
          groupBy: {
            args: Prisma.foundersGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FoundersGroupByOutputType>[]
          }
          count: {
            args: Prisma.foundersCountArgs<ExtArgs>,
            result: $Utils.Optional<FoundersCountAggregateOutputType> | number
          }
        }
      }
      website_info: {
        payload: Prisma.$website_infoPayload<ExtArgs>
        fields: Prisma.website_infoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.website_infoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.website_infoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          findFirst: {
            args: Prisma.website_infoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.website_infoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          findMany: {
            args: Prisma.website_infoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>[]
          }
          create: {
            args: Prisma.website_infoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          createMany: {
            args: Prisma.website_infoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.website_infoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          update: {
            args: Prisma.website_infoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          deleteMany: {
            args: Prisma.website_infoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.website_infoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.website_infoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$website_infoPayload>
          }
          aggregate: {
            args: Prisma.Website_infoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateWebsite_info>
          }
          groupBy: {
            args: Prisma.website_infoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Website_infoGroupByOutputType>[]
          }
          count: {
            args: Prisma.website_infoCountArgs<ExtArgs>,
            result: $Utils.Optional<Website_infoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type Vendor_companiesCountOutputType
   */

  export type Vendor_companiesCountOutputType = {
    traffic_info: number
    linkedin_info: number
    funding_info: number
    website_info: number
  }

  export type Vendor_companiesCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    traffic_info?: boolean | Vendor_companiesCountOutputTypeCountTraffic_infoArgs
    linkedin_info?: boolean | Vendor_companiesCountOutputTypeCountLinkedin_infoArgs
    funding_info?: boolean | Vendor_companiesCountOutputTypeCountFunding_infoArgs
    website_info?: boolean | Vendor_companiesCountOutputTypeCountWebsite_infoArgs
  }

  // Custom InputTypes

  /**
   * Vendor_companiesCountOutputType without action
   */
  export type Vendor_companiesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor_companiesCountOutputType
     */
    select?: Vendor_companiesCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * Vendor_companiesCountOutputType without action
   */
  export type Vendor_companiesCountOutputTypeCountTraffic_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: traffic_infoWhereInput
  }


  /**
   * Vendor_companiesCountOutputType without action
   */
  export type Vendor_companiesCountOutputTypeCountLinkedin_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: linkedin_infoWhereInput
  }


  /**
   * Vendor_companiesCountOutputType without action
   */
  export type Vendor_companiesCountOutputTypeCountFunding_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: funding_infoWhereInput
  }


  /**
   * Vendor_companiesCountOutputType without action
   */
  export type Vendor_companiesCountOutputTypeCountWebsite_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: website_infoWhereInput
  }



  /**
   * Count Type Linkedin_infoCountOutputType
   */

  export type Linkedin_infoCountOutputType = {
    company_specialties_collection: number
    company_featured_employees_collection: number
    locations_collection: number
  }

  export type Linkedin_infoCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    company_specialties_collection?: boolean | Linkedin_infoCountOutputTypeCountCompany_specialties_collectionArgs
    company_featured_employees_collection?: boolean | Linkedin_infoCountOutputTypeCountCompany_featured_employees_collectionArgs
    locations_collection?: boolean | Linkedin_infoCountOutputTypeCountLocations_collectionArgs
  }

  // Custom InputTypes

  /**
   * Linkedin_infoCountOutputType without action
   */
  export type Linkedin_infoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Linkedin_infoCountOutputType
     */
    select?: Linkedin_infoCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * Linkedin_infoCountOutputType without action
   */
  export type Linkedin_infoCountOutputTypeCountCompany_specialties_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: company_specialtiesWhereInput
  }


  /**
   * Linkedin_infoCountOutputType without action
   */
  export type Linkedin_infoCountOutputTypeCountCompany_featured_employees_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: featured_employeesWhereInput
  }


  /**
   * Linkedin_infoCountOutputType without action
   */
  export type Linkedin_infoCountOutputTypeCountLocations_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: locationsWhereInput
  }



  /**
   * Count Type Funding_infoCountOutputType
   */

  export type Funding_infoCountOutputType = {
    categories: number
    press_references: number
    raised_funding_rounds: number
    founders: number
  }

  export type Funding_infoCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    categories?: boolean | Funding_infoCountOutputTypeCountCategoriesArgs
    press_references?: boolean | Funding_infoCountOutputTypeCountPress_referencesArgs
    raised_funding_rounds?: boolean | Funding_infoCountOutputTypeCountRaised_funding_roundsArgs
    founders?: boolean | Funding_infoCountOutputTypeCountFoundersArgs
  }

  // Custom InputTypes

  /**
   * Funding_infoCountOutputType without action
   */
  export type Funding_infoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funding_infoCountOutputType
     */
    select?: Funding_infoCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * Funding_infoCountOutputType without action
   */
  export type Funding_infoCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: categoriesWhereInput
  }


  /**
   * Funding_infoCountOutputType without action
   */
  export type Funding_infoCountOutputTypeCountPress_referencesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: press_referencesWhereInput
  }


  /**
   * Funding_infoCountOutputType without action
   */
  export type Funding_infoCountOutputTypeCountRaised_funding_roundsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: funding_roundsWhereInput
  }


  /**
   * Funding_infoCountOutputType without action
   */
  export type Funding_infoCountOutputTypeCountFoundersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: foundersWhereInput
  }



  /**
   * Models
   */

  /**
   * Model vendor_companies
   */

  export type AggregateVendor_companies = {
    _count: Vendor_companiesCountAggregateOutputType | null
    _min: Vendor_companiesMinAggregateOutputType | null
    _max: Vendor_companiesMaxAggregateOutputType | null
  }

  export type Vendor_companiesMinAggregateOutputType = {
    id: string | null
    company_name: string | null
    website_url: string | null
    linkedin_url: string | null
    type: string | null
    is_active: boolean | null
    is_cromatic_vendor: boolean | null
  }

  export type Vendor_companiesMaxAggregateOutputType = {
    id: string | null
    company_name: string | null
    website_url: string | null
    linkedin_url: string | null
    type: string | null
    is_active: boolean | null
    is_cromatic_vendor: boolean | null
  }

  export type Vendor_companiesCountAggregateOutputType = {
    id: number
    company_name: number
    website_url: number
    linkedin_url: number
    type: number
    is_active: number
    is_cromatic_vendor: number
    _all: number
  }


  export type Vendor_companiesMinAggregateInputType = {
    id?: true
    company_name?: true
    website_url?: true
    linkedin_url?: true
    type?: true
    is_active?: true
    is_cromatic_vendor?: true
  }

  export type Vendor_companiesMaxAggregateInputType = {
    id?: true
    company_name?: true
    website_url?: true
    linkedin_url?: true
    type?: true
    is_active?: true
    is_cromatic_vendor?: true
  }

  export type Vendor_companiesCountAggregateInputType = {
    id?: true
    company_name?: true
    website_url?: true
    linkedin_url?: true
    type?: true
    is_active?: true
    is_cromatic_vendor?: true
    _all?: true
  }

  export type Vendor_companiesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which vendor_companies to aggregate.
     */
    where?: vendor_companiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vendor_companies to fetch.
     */
    orderBy?: vendor_companiesOrderByWithRelationInput | vendor_companiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: vendor_companiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vendor_companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vendor_companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned vendor_companies
    **/
    _count?: true | Vendor_companiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Vendor_companiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Vendor_companiesMaxAggregateInputType
  }

  export type GetVendor_companiesAggregateType<T extends Vendor_companiesAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor_companies]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor_companies[P]>
      : GetScalarType<T[P], AggregateVendor_companies[P]>
  }




  export type vendor_companiesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: vendor_companiesWhereInput
    orderBy?: vendor_companiesOrderByWithAggregationInput | vendor_companiesOrderByWithAggregationInput[]
    by: Vendor_companiesScalarFieldEnum[] | Vendor_companiesScalarFieldEnum
    having?: vendor_companiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Vendor_companiesCountAggregateInputType | true
    _min?: Vendor_companiesMinAggregateInputType
    _max?: Vendor_companiesMaxAggregateInputType
  }

  export type Vendor_companiesGroupByOutputType = {
    id: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    _count: Vendor_companiesCountAggregateOutputType | null
    _min: Vendor_companiesMinAggregateOutputType | null
    _max: Vendor_companiesMaxAggregateOutputType | null
  }

  type GetVendor_companiesGroupByPayload<T extends vendor_companiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Vendor_companiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Vendor_companiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Vendor_companiesGroupByOutputType[P]>
            : GetScalarType<T[P], Vendor_companiesGroupByOutputType[P]>
        }
      >
    >


  export type vendor_companiesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_name?: boolean
    website_url?: boolean
    linkedin_url?: boolean
    type?: boolean
    is_active?: boolean
    is_cromatic_vendor?: boolean
    traffic_info?: boolean | vendor_companies$traffic_infoArgs<ExtArgs>
    linkedin_info?: boolean | vendor_companies$linkedin_infoArgs<ExtArgs>
    funding_info?: boolean | vendor_companies$funding_infoArgs<ExtArgs>
    website_info?: boolean | vendor_companies$website_infoArgs<ExtArgs>
    _count?: boolean | Vendor_companiesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor_companies"]>

  export type vendor_companiesSelectScalar = {
    id?: boolean
    company_name?: boolean
    website_url?: boolean
    linkedin_url?: boolean
    type?: boolean
    is_active?: boolean
    is_cromatic_vendor?: boolean
  }

  export type vendor_companiesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    traffic_info?: boolean | vendor_companies$traffic_infoArgs<ExtArgs>
    linkedin_info?: boolean | vendor_companies$linkedin_infoArgs<ExtArgs>
    funding_info?: boolean | vendor_companies$funding_infoArgs<ExtArgs>
    website_info?: boolean | vendor_companies$website_infoArgs<ExtArgs>
    _count?: boolean | Vendor_companiesCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $vendor_companiesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "vendor_companies"
    objects: {
      traffic_info: Prisma.$traffic_infoPayload<ExtArgs>[]
      linkedin_info: Prisma.$linkedin_infoPayload<ExtArgs>[]
      funding_info: Prisma.$funding_infoPayload<ExtArgs>[]
      website_info: Prisma.$website_infoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetResult<{
      id: string
      company_name: string
      website_url: string
      linkedin_url: string
      type: string
      is_active: boolean
      is_cromatic_vendor: boolean
    }, ExtArgs["result"]["vendor_companies"]>
    composites: {}
  }


  type vendor_companiesGetPayload<S extends boolean | null | undefined | vendor_companiesDefaultArgs> = $Result.GetResult<Prisma.$vendor_companiesPayload, S>

  type vendor_companiesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<vendor_companiesFindManyArgs, 'select' | 'include'> & {
      select?: Vendor_companiesCountAggregateInputType | true
    }

  export interface vendor_companiesDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['vendor_companies'], meta: { name: 'vendor_companies' } }
    /**
     * Find zero or one Vendor_companies that matches the filter.
     * @param {vendor_companiesFindUniqueArgs} args - Arguments to find a Vendor_companies
     * @example
     * // Get one Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends vendor_companiesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesFindUniqueArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Vendor_companies that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {vendor_companiesFindUniqueOrThrowArgs} args - Arguments to find a Vendor_companies
     * @example
     * // Get one Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends vendor_companiesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Vendor_companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesFindFirstArgs} args - Arguments to find a Vendor_companies
     * @example
     * // Get one Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends vendor_companiesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesFindFirstArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Vendor_companies that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesFindFirstOrThrowArgs} args - Arguments to find a Vendor_companies
     * @example
     * // Get one Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends vendor_companiesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Vendor_companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findMany()
     * 
     * // Get first 10 Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendor_companiesWithIdOnly = await prisma.vendor_companies.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends vendor_companiesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Vendor_companies.
     * @param {vendor_companiesCreateArgs} args - Arguments to create a Vendor_companies.
     * @example
     * // Create one Vendor_companies
     * const Vendor_companies = await prisma.vendor_companies.create({
     *   data: {
     *     // ... data to create a Vendor_companies
     *   }
     * })
     * 
    **/
    create<T extends vendor_companiesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesCreateArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Vendor_companies.
     *     @param {vendor_companiesCreateManyArgs} args - Arguments to create many Vendor_companies.
     *     @example
     *     // Create many Vendor_companies
     *     const vendor_companies = await prisma.vendor_companies.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends vendor_companiesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Vendor_companies.
     * @param {vendor_companiesDeleteArgs} args - Arguments to delete one Vendor_companies.
     * @example
     * // Delete one Vendor_companies
     * const Vendor_companies = await prisma.vendor_companies.delete({
     *   where: {
     *     // ... filter to delete one Vendor_companies
     *   }
     * })
     * 
    **/
    delete<T extends vendor_companiesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesDeleteArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Vendor_companies.
     * @param {vendor_companiesUpdateArgs} args - Arguments to update one Vendor_companies.
     * @example
     * // Update one Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends vendor_companiesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesUpdateArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Vendor_companies.
     * @param {vendor_companiesDeleteManyArgs} args - Arguments to filter Vendor_companies to delete.
     * @example
     * // Delete a few Vendor_companies
     * const { count } = await prisma.vendor_companies.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends vendor_companiesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, vendor_companiesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendor_companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends vendor_companiesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vendor_companies.
     * @param {vendor_companiesUpsertArgs} args - Arguments to update or create a Vendor_companies.
     * @example
     * // Update or create a Vendor_companies
     * const vendor_companies = await prisma.vendor_companies.upsert({
     *   create: {
     *     // ... data to create a Vendor_companies
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor_companies we want to update
     *   }
     * })
    **/
    upsert<T extends vendor_companiesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, vendor_companiesUpsertArgs<ExtArgs>>
    ): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Vendor_companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesCountArgs} args - Arguments to filter Vendor_companies to count.
     * @example
     * // Count the number of Vendor_companies
     * const count = await prisma.vendor_companies.count({
     *   where: {
     *     // ... the filter for the Vendor_companies we want to count
     *   }
     * })
    **/
    count<T extends vendor_companiesCountArgs>(
      args?: Subset<T, vendor_companiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Vendor_companiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor_companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Vendor_companiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Vendor_companiesAggregateArgs>(args: Subset<T, Vendor_companiesAggregateArgs>): Prisma.PrismaPromise<GetVendor_companiesAggregateType<T>>

    /**
     * Group by Vendor_companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vendor_companiesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends vendor_companiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: vendor_companiesGroupByArgs['orderBy'] }
        : { orderBy?: vendor_companiesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, vendor_companiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendor_companiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the vendor_companies model
   */
  readonly fields: vendor_companiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for vendor_companies.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__vendor_companiesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    traffic_info<T extends vendor_companies$traffic_infoArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companies$traffic_infoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findMany'> | Null>;

    linkedin_info<T extends vendor_companies$linkedin_infoArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companies$linkedin_infoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findMany'> | Null>;

    funding_info<T extends vendor_companies$funding_infoArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companies$funding_infoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findMany'> | Null>;

    website_info<T extends vendor_companies$website_infoArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companies$website_infoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the vendor_companies model
   */ 
  interface vendor_companiesFieldRefs {
    readonly id: FieldRef<"vendor_companies", 'String'>
    readonly company_name: FieldRef<"vendor_companies", 'String'>
    readonly website_url: FieldRef<"vendor_companies", 'String'>
    readonly linkedin_url: FieldRef<"vendor_companies", 'String'>
    readonly type: FieldRef<"vendor_companies", 'String'>
    readonly is_active: FieldRef<"vendor_companies", 'Boolean'>
    readonly is_cromatic_vendor: FieldRef<"vendor_companies", 'Boolean'>
  }
    

  // Custom InputTypes

  /**
   * vendor_companies findUnique
   */
  export type vendor_companiesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter, which vendor_companies to fetch.
     */
    where: vendor_companiesWhereUniqueInput
  }


  /**
   * vendor_companies findUniqueOrThrow
   */
  export type vendor_companiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter, which vendor_companies to fetch.
     */
    where: vendor_companiesWhereUniqueInput
  }


  /**
   * vendor_companies findFirst
   */
  export type vendor_companiesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter, which vendor_companies to fetch.
     */
    where?: vendor_companiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vendor_companies to fetch.
     */
    orderBy?: vendor_companiesOrderByWithRelationInput | vendor_companiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vendor_companies.
     */
    cursor?: vendor_companiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vendor_companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vendor_companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vendor_companies.
     */
    distinct?: Vendor_companiesScalarFieldEnum | Vendor_companiesScalarFieldEnum[]
  }


  /**
   * vendor_companies findFirstOrThrow
   */
  export type vendor_companiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter, which vendor_companies to fetch.
     */
    where?: vendor_companiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vendor_companies to fetch.
     */
    orderBy?: vendor_companiesOrderByWithRelationInput | vendor_companiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vendor_companies.
     */
    cursor?: vendor_companiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vendor_companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vendor_companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vendor_companies.
     */
    distinct?: Vendor_companiesScalarFieldEnum | Vendor_companiesScalarFieldEnum[]
  }


  /**
   * vendor_companies findMany
   */
  export type vendor_companiesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter, which vendor_companies to fetch.
     */
    where?: vendor_companiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vendor_companies to fetch.
     */
    orderBy?: vendor_companiesOrderByWithRelationInput | vendor_companiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing vendor_companies.
     */
    cursor?: vendor_companiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vendor_companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vendor_companies.
     */
    skip?: number
    distinct?: Vendor_companiesScalarFieldEnum | Vendor_companiesScalarFieldEnum[]
  }


  /**
   * vendor_companies create
   */
  export type vendor_companiesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * The data needed to create a vendor_companies.
     */
    data: XOR<vendor_companiesCreateInput, vendor_companiesUncheckedCreateInput>
  }


  /**
   * vendor_companies createMany
   */
  export type vendor_companiesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many vendor_companies.
     */
    data: vendor_companiesCreateManyInput | vendor_companiesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * vendor_companies update
   */
  export type vendor_companiesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * The data needed to update a vendor_companies.
     */
    data: XOR<vendor_companiesUpdateInput, vendor_companiesUncheckedUpdateInput>
    /**
     * Choose, which vendor_companies to update.
     */
    where: vendor_companiesWhereUniqueInput
  }


  /**
   * vendor_companies updateMany
   */
  export type vendor_companiesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update vendor_companies.
     */
    data: XOR<vendor_companiesUpdateManyMutationInput, vendor_companiesUncheckedUpdateManyInput>
    /**
     * Filter which vendor_companies to update
     */
    where?: vendor_companiesWhereInput
  }


  /**
   * vendor_companies upsert
   */
  export type vendor_companiesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * The filter to search for the vendor_companies to update in case it exists.
     */
    where: vendor_companiesWhereUniqueInput
    /**
     * In case the vendor_companies found by the `where` argument doesn't exist, create a new vendor_companies with this data.
     */
    create: XOR<vendor_companiesCreateInput, vendor_companiesUncheckedCreateInput>
    /**
     * In case the vendor_companies was found with the provided `where` argument, update it with this data.
     */
    update: XOR<vendor_companiesUpdateInput, vendor_companiesUncheckedUpdateInput>
  }


  /**
   * vendor_companies delete
   */
  export type vendor_companiesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
    /**
     * Filter which vendor_companies to delete.
     */
    where: vendor_companiesWhereUniqueInput
  }


  /**
   * vendor_companies deleteMany
   */
  export type vendor_companiesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which vendor_companies to delete
     */
    where?: vendor_companiesWhereInput
  }


  /**
   * vendor_companies.traffic_info
   */
  export type vendor_companies$traffic_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    where?: traffic_infoWhereInput
    orderBy?: traffic_infoOrderByWithRelationInput | traffic_infoOrderByWithRelationInput[]
    cursor?: traffic_infoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Traffic_infoScalarFieldEnum | Traffic_infoScalarFieldEnum[]
  }


  /**
   * vendor_companies.linkedin_info
   */
  export type vendor_companies$linkedin_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    where?: linkedin_infoWhereInput
    orderBy?: linkedin_infoOrderByWithRelationInput | linkedin_infoOrderByWithRelationInput[]
    cursor?: linkedin_infoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Linkedin_infoScalarFieldEnum | Linkedin_infoScalarFieldEnum[]
  }


  /**
   * vendor_companies.funding_info
   */
  export type vendor_companies$funding_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    where?: funding_infoWhereInput
    orderBy?: funding_infoOrderByWithRelationInput | funding_infoOrderByWithRelationInput[]
    cursor?: funding_infoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Funding_infoScalarFieldEnum | Funding_infoScalarFieldEnum[]
  }


  /**
   * vendor_companies.website_info
   */
  export type vendor_companies$website_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    where?: website_infoWhereInput
    orderBy?: website_infoOrderByWithRelationInput | website_infoOrderByWithRelationInput[]
    cursor?: website_infoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Website_infoScalarFieldEnum | Website_infoScalarFieldEnum[]
  }


  /**
   * vendor_companies without action
   */
  export type vendor_companiesDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vendor_companies
     */
    select?: vendor_companiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: vendor_companiesInclude<ExtArgs> | null
  }



  /**
   * Model traffic_info
   */

  export type AggregateTraffic_info = {
    _count: Traffic_infoCountAggregateOutputType | null
    _avg: Traffic_infoAvgAggregateOutputType | null
    _sum: Traffic_infoSumAggregateOutputType | null
    _min: Traffic_infoMinAggregateOutputType | null
    _max: Traffic_infoMaxAggregateOutputType | null
  }

  export type Traffic_infoAvgAggregateOutputType = {
    rank: number | null
    visits: number | null
    users: number | null
    search_organic: number | null
    search_paid: number | null
    social_organic: number | null
    social_paid: number | null
    referral: number | null
    time_on_site: number | null
    pages_per_visit: number | null
    bounce_rate: number | null
  }

  export type Traffic_infoSumAggregateOutputType = {
    rank: number | null
    visits: number | null
    users: number | null
    search_organic: number | null
    search_paid: number | null
    social_organic: number | null
    social_paid: number | null
    referral: number | null
    time_on_site: number | null
    pages_per_visit: number | null
    bounce_rate: number | null
  }

  export type Traffic_infoMinAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    display_date: Date | null
    rank: number | null
    visits: number | null
    users: number | null
    search_organic: number | null
    search_paid: number | null
    social_organic: number | null
    social_paid: number | null
    referral: number | null
    time_on_site: number | null
    pages_per_visit: number | null
    bounce_rate: number | null
    categories: string | null
  }

  export type Traffic_infoMaxAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    display_date: Date | null
    rank: number | null
    visits: number | null
    users: number | null
    search_organic: number | null
    search_paid: number | null
    social_organic: number | null
    social_paid: number | null
    referral: number | null
    time_on_site: number | null
    pages_per_visit: number | null
    bounce_rate: number | null
    categories: string | null
  }

  export type Traffic_infoCountAggregateOutputType = {
    id: number
    company_id: number
    last_updated: number
    display_date: number
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: number
    _all: number
  }


  export type Traffic_infoAvgAggregateInputType = {
    rank?: true
    visits?: true
    users?: true
    search_organic?: true
    search_paid?: true
    social_organic?: true
    social_paid?: true
    referral?: true
    time_on_site?: true
    pages_per_visit?: true
    bounce_rate?: true
  }

  export type Traffic_infoSumAggregateInputType = {
    rank?: true
    visits?: true
    users?: true
    search_organic?: true
    search_paid?: true
    social_organic?: true
    social_paid?: true
    referral?: true
    time_on_site?: true
    pages_per_visit?: true
    bounce_rate?: true
  }

  export type Traffic_infoMinAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    display_date?: true
    rank?: true
    visits?: true
    users?: true
    search_organic?: true
    search_paid?: true
    social_organic?: true
    social_paid?: true
    referral?: true
    time_on_site?: true
    pages_per_visit?: true
    bounce_rate?: true
    categories?: true
  }

  export type Traffic_infoMaxAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    display_date?: true
    rank?: true
    visits?: true
    users?: true
    search_organic?: true
    search_paid?: true
    social_organic?: true
    social_paid?: true
    referral?: true
    time_on_site?: true
    pages_per_visit?: true
    bounce_rate?: true
    categories?: true
  }

  export type Traffic_infoCountAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    display_date?: true
    rank?: true
    visits?: true
    users?: true
    search_organic?: true
    search_paid?: true
    social_organic?: true
    social_paid?: true
    referral?: true
    time_on_site?: true
    pages_per_visit?: true
    bounce_rate?: true
    categories?: true
    _all?: true
  }

  export type Traffic_infoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which traffic_info to aggregate.
     */
    where?: traffic_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of traffic_infos to fetch.
     */
    orderBy?: traffic_infoOrderByWithRelationInput | traffic_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: traffic_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` traffic_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` traffic_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned traffic_infos
    **/
    _count?: true | Traffic_infoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Traffic_infoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Traffic_infoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Traffic_infoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Traffic_infoMaxAggregateInputType
  }

  export type GetTraffic_infoAggregateType<T extends Traffic_infoAggregateArgs> = {
        [P in keyof T & keyof AggregateTraffic_info]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTraffic_info[P]>
      : GetScalarType<T[P], AggregateTraffic_info[P]>
  }




  export type traffic_infoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: traffic_infoWhereInput
    orderBy?: traffic_infoOrderByWithAggregationInput | traffic_infoOrderByWithAggregationInput[]
    by: Traffic_infoScalarFieldEnum[] | Traffic_infoScalarFieldEnum
    having?: traffic_infoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Traffic_infoCountAggregateInputType | true
    _avg?: Traffic_infoAvgAggregateInputType
    _sum?: Traffic_infoSumAggregateInputType
    _min?: Traffic_infoMinAggregateInputType
    _max?: Traffic_infoMaxAggregateInputType
  }

  export type Traffic_infoGroupByOutputType = {
    id: string
    company_id: string
    last_updated: Date
    display_date: Date
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
    _count: Traffic_infoCountAggregateOutputType | null
    _avg: Traffic_infoAvgAggregateOutputType | null
    _sum: Traffic_infoSumAggregateOutputType | null
    _min: Traffic_infoMinAggregateOutputType | null
    _max: Traffic_infoMaxAggregateOutputType | null
  }

  type GetTraffic_infoGroupByPayload<T extends traffic_infoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Traffic_infoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Traffic_infoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Traffic_infoGroupByOutputType[P]>
            : GetScalarType<T[P], Traffic_infoGroupByOutputType[P]>
        }
      >
    >


  export type traffic_infoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    display_date?: boolean
    rank?: boolean
    visits?: boolean
    users?: boolean
    search_organic?: boolean
    search_paid?: boolean
    social_organic?: boolean
    social_paid?: boolean
    referral?: boolean
    time_on_site?: boolean
    pages_per_visit?: boolean
    bounce_rate?: boolean
    categories?: boolean
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["traffic_info"]>

  export type traffic_infoSelectScalar = {
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    display_date?: boolean
    rank?: boolean
    visits?: boolean
    users?: boolean
    search_organic?: boolean
    search_paid?: boolean
    social_organic?: boolean
    social_paid?: boolean
    referral?: boolean
    time_on_site?: boolean
    pages_per_visit?: boolean
    bounce_rate?: boolean
    categories?: boolean
  }

  export type traffic_infoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
  }


  export type $traffic_infoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "traffic_info"
    objects: {
      vendor_company: Prisma.$vendor_companiesPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      company_id: string
      last_updated: Date
      display_date: Date
      rank: number
      visits: number
      users: number
      search_organic: number
      search_paid: number
      social_organic: number
      social_paid: number
      referral: number
      time_on_site: number
      pages_per_visit: number
      bounce_rate: number
      categories: string
    }, ExtArgs["result"]["traffic_info"]>
    composites: {}
  }


  type traffic_infoGetPayload<S extends boolean | null | undefined | traffic_infoDefaultArgs> = $Result.GetResult<Prisma.$traffic_infoPayload, S>

  type traffic_infoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<traffic_infoFindManyArgs, 'select' | 'include'> & {
      select?: Traffic_infoCountAggregateInputType | true
    }

  export interface traffic_infoDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['traffic_info'], meta: { name: 'traffic_info' } }
    /**
     * Find zero or one Traffic_info that matches the filter.
     * @param {traffic_infoFindUniqueArgs} args - Arguments to find a Traffic_info
     * @example
     * // Get one Traffic_info
     * const traffic_info = await prisma.traffic_info.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends traffic_infoFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoFindUniqueArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Traffic_info that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {traffic_infoFindUniqueOrThrowArgs} args - Arguments to find a Traffic_info
     * @example
     * // Get one Traffic_info
     * const traffic_info = await prisma.traffic_info.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends traffic_infoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Traffic_info that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoFindFirstArgs} args - Arguments to find a Traffic_info
     * @example
     * // Get one Traffic_info
     * const traffic_info = await prisma.traffic_info.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends traffic_infoFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoFindFirstArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Traffic_info that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoFindFirstOrThrowArgs} args - Arguments to find a Traffic_info
     * @example
     * // Get one Traffic_info
     * const traffic_info = await prisma.traffic_info.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends traffic_infoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Traffic_infos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Traffic_infos
     * const traffic_infos = await prisma.traffic_info.findMany()
     * 
     * // Get first 10 Traffic_infos
     * const traffic_infos = await prisma.traffic_info.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const traffic_infoWithIdOnly = await prisma.traffic_info.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends traffic_infoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Traffic_info.
     * @param {traffic_infoCreateArgs} args - Arguments to create a Traffic_info.
     * @example
     * // Create one Traffic_info
     * const Traffic_info = await prisma.traffic_info.create({
     *   data: {
     *     // ... data to create a Traffic_info
     *   }
     * })
     * 
    **/
    create<T extends traffic_infoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoCreateArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Traffic_infos.
     *     @param {traffic_infoCreateManyArgs} args - Arguments to create many Traffic_infos.
     *     @example
     *     // Create many Traffic_infos
     *     const traffic_info = await prisma.traffic_info.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends traffic_infoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Traffic_info.
     * @param {traffic_infoDeleteArgs} args - Arguments to delete one Traffic_info.
     * @example
     * // Delete one Traffic_info
     * const Traffic_info = await prisma.traffic_info.delete({
     *   where: {
     *     // ... filter to delete one Traffic_info
     *   }
     * })
     * 
    **/
    delete<T extends traffic_infoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoDeleteArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Traffic_info.
     * @param {traffic_infoUpdateArgs} args - Arguments to update one Traffic_info.
     * @example
     * // Update one Traffic_info
     * const traffic_info = await prisma.traffic_info.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends traffic_infoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoUpdateArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Traffic_infos.
     * @param {traffic_infoDeleteManyArgs} args - Arguments to filter Traffic_infos to delete.
     * @example
     * // Delete a few Traffic_infos
     * const { count } = await prisma.traffic_info.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends traffic_infoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, traffic_infoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Traffic_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Traffic_infos
     * const traffic_info = await prisma.traffic_info.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends traffic_infoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Traffic_info.
     * @param {traffic_infoUpsertArgs} args - Arguments to update or create a Traffic_info.
     * @example
     * // Update or create a Traffic_info
     * const traffic_info = await prisma.traffic_info.upsert({
     *   create: {
     *     // ... data to create a Traffic_info
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Traffic_info we want to update
     *   }
     * })
    **/
    upsert<T extends traffic_infoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, traffic_infoUpsertArgs<ExtArgs>>
    ): Prisma__traffic_infoClient<$Result.GetResult<Prisma.$traffic_infoPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Traffic_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoCountArgs} args - Arguments to filter Traffic_infos to count.
     * @example
     * // Count the number of Traffic_infos
     * const count = await prisma.traffic_info.count({
     *   where: {
     *     // ... the filter for the Traffic_infos we want to count
     *   }
     * })
    **/
    count<T extends traffic_infoCountArgs>(
      args?: Subset<T, traffic_infoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Traffic_infoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Traffic_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Traffic_infoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Traffic_infoAggregateArgs>(args: Subset<T, Traffic_infoAggregateArgs>): Prisma.PrismaPromise<GetTraffic_infoAggregateType<T>>

    /**
     * Group by Traffic_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {traffic_infoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends traffic_infoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: traffic_infoGroupByArgs['orderBy'] }
        : { orderBy?: traffic_infoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, traffic_infoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTraffic_infoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the traffic_info model
   */
  readonly fields: traffic_infoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for traffic_info.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__traffic_infoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vendor_company<T extends vendor_companiesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companiesDefaultArgs<ExtArgs>>): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the traffic_info model
   */ 
  interface traffic_infoFieldRefs {
    readonly id: FieldRef<"traffic_info", 'String'>
    readonly company_id: FieldRef<"traffic_info", 'String'>
    readonly last_updated: FieldRef<"traffic_info", 'DateTime'>
    readonly display_date: FieldRef<"traffic_info", 'DateTime'>
    readonly rank: FieldRef<"traffic_info", 'Int'>
    readonly visits: FieldRef<"traffic_info", 'Int'>
    readonly users: FieldRef<"traffic_info", 'Int'>
    readonly search_organic: FieldRef<"traffic_info", 'Int'>
    readonly search_paid: FieldRef<"traffic_info", 'Int'>
    readonly social_organic: FieldRef<"traffic_info", 'Int'>
    readonly social_paid: FieldRef<"traffic_info", 'Int'>
    readonly referral: FieldRef<"traffic_info", 'Int'>
    readonly time_on_site: FieldRef<"traffic_info", 'Int'>
    readonly pages_per_visit: FieldRef<"traffic_info", 'Float'>
    readonly bounce_rate: FieldRef<"traffic_info", 'Float'>
    readonly categories: FieldRef<"traffic_info", 'String'>
  }
    

  // Custom InputTypes

  /**
   * traffic_info findUnique
   */
  export type traffic_infoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter, which traffic_info to fetch.
     */
    where: traffic_infoWhereUniqueInput
  }


  /**
   * traffic_info findUniqueOrThrow
   */
  export type traffic_infoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter, which traffic_info to fetch.
     */
    where: traffic_infoWhereUniqueInput
  }


  /**
   * traffic_info findFirst
   */
  export type traffic_infoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter, which traffic_info to fetch.
     */
    where?: traffic_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of traffic_infos to fetch.
     */
    orderBy?: traffic_infoOrderByWithRelationInput | traffic_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for traffic_infos.
     */
    cursor?: traffic_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` traffic_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` traffic_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of traffic_infos.
     */
    distinct?: Traffic_infoScalarFieldEnum | Traffic_infoScalarFieldEnum[]
  }


  /**
   * traffic_info findFirstOrThrow
   */
  export type traffic_infoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter, which traffic_info to fetch.
     */
    where?: traffic_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of traffic_infos to fetch.
     */
    orderBy?: traffic_infoOrderByWithRelationInput | traffic_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for traffic_infos.
     */
    cursor?: traffic_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` traffic_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` traffic_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of traffic_infos.
     */
    distinct?: Traffic_infoScalarFieldEnum | Traffic_infoScalarFieldEnum[]
  }


  /**
   * traffic_info findMany
   */
  export type traffic_infoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter, which traffic_infos to fetch.
     */
    where?: traffic_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of traffic_infos to fetch.
     */
    orderBy?: traffic_infoOrderByWithRelationInput | traffic_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing traffic_infos.
     */
    cursor?: traffic_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` traffic_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` traffic_infos.
     */
    skip?: number
    distinct?: Traffic_infoScalarFieldEnum | Traffic_infoScalarFieldEnum[]
  }


  /**
   * traffic_info create
   */
  export type traffic_infoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * The data needed to create a traffic_info.
     */
    data: XOR<traffic_infoCreateInput, traffic_infoUncheckedCreateInput>
  }


  /**
   * traffic_info createMany
   */
  export type traffic_infoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many traffic_infos.
     */
    data: traffic_infoCreateManyInput | traffic_infoCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * traffic_info update
   */
  export type traffic_infoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * The data needed to update a traffic_info.
     */
    data: XOR<traffic_infoUpdateInput, traffic_infoUncheckedUpdateInput>
    /**
     * Choose, which traffic_info to update.
     */
    where: traffic_infoWhereUniqueInput
  }


  /**
   * traffic_info updateMany
   */
  export type traffic_infoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update traffic_infos.
     */
    data: XOR<traffic_infoUpdateManyMutationInput, traffic_infoUncheckedUpdateManyInput>
    /**
     * Filter which traffic_infos to update
     */
    where?: traffic_infoWhereInput
  }


  /**
   * traffic_info upsert
   */
  export type traffic_infoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * The filter to search for the traffic_info to update in case it exists.
     */
    where: traffic_infoWhereUniqueInput
    /**
     * In case the traffic_info found by the `where` argument doesn't exist, create a new traffic_info with this data.
     */
    create: XOR<traffic_infoCreateInput, traffic_infoUncheckedCreateInput>
    /**
     * In case the traffic_info was found with the provided `where` argument, update it with this data.
     */
    update: XOR<traffic_infoUpdateInput, traffic_infoUncheckedUpdateInput>
  }


  /**
   * traffic_info delete
   */
  export type traffic_infoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
    /**
     * Filter which traffic_info to delete.
     */
    where: traffic_infoWhereUniqueInput
  }


  /**
   * traffic_info deleteMany
   */
  export type traffic_infoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which traffic_infos to delete
     */
    where?: traffic_infoWhereInput
  }


  /**
   * traffic_info without action
   */
  export type traffic_infoDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the traffic_info
     */
    select?: traffic_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: traffic_infoInclude<ExtArgs> | null
  }



  /**
   * Model linkedin_info
   */

  export type AggregateLinkedin_info = {
    _count: Linkedin_infoCountAggregateOutputType | null
    _avg: Linkedin_infoAvgAggregateOutputType | null
    _sum: Linkedin_infoSumAggregateOutputType | null
    _min: Linkedin_infoMinAggregateOutputType | null
    _max: Linkedin_infoMaxAggregateOutputType | null
  }

  export type Linkedin_infoAvgAggregateOutputType = {
    linkedin_followers: number | null
    founded: number | null
    employees_count: number | null
  }

  export type Linkedin_infoSumAggregateOutputType = {
    linkedin_followers: number | null
    founded: number | null
    employees_count: number | null
  }

  export type Linkedin_infoMinAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    company_size: string | null
    industry: string | null
    description: string | null
    linkedin_followers: number | null
    founded: number | null
    created: Date | null
    li_last_updated: Date | null
    type: string | null
    employees_count: number | null
  }

  export type Linkedin_infoMaxAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    company_size: string | null
    industry: string | null
    description: string | null
    linkedin_followers: number | null
    founded: number | null
    created: Date | null
    li_last_updated: Date | null
    type: string | null
    employees_count: number | null
  }

  export type Linkedin_infoCountAggregateOutputType = {
    id: number
    company_id: number
    last_updated: number
    company_size: number
    industry: number
    description: number
    linkedin_followers: number
    founded: number
    created: number
    li_last_updated: number
    type: number
    employees_count: number
    _all: number
  }


  export type Linkedin_infoAvgAggregateInputType = {
    linkedin_followers?: true
    founded?: true
    employees_count?: true
  }

  export type Linkedin_infoSumAggregateInputType = {
    linkedin_followers?: true
    founded?: true
    employees_count?: true
  }

  export type Linkedin_infoMinAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_size?: true
    industry?: true
    description?: true
    linkedin_followers?: true
    founded?: true
    created?: true
    li_last_updated?: true
    type?: true
    employees_count?: true
  }

  export type Linkedin_infoMaxAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_size?: true
    industry?: true
    description?: true
    linkedin_followers?: true
    founded?: true
    created?: true
    li_last_updated?: true
    type?: true
    employees_count?: true
  }

  export type Linkedin_infoCountAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_size?: true
    industry?: true
    description?: true
    linkedin_followers?: true
    founded?: true
    created?: true
    li_last_updated?: true
    type?: true
    employees_count?: true
    _all?: true
  }

  export type Linkedin_infoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which linkedin_info to aggregate.
     */
    where?: linkedin_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of linkedin_infos to fetch.
     */
    orderBy?: linkedin_infoOrderByWithRelationInput | linkedin_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: linkedin_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` linkedin_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` linkedin_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned linkedin_infos
    **/
    _count?: true | Linkedin_infoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Linkedin_infoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Linkedin_infoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Linkedin_infoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Linkedin_infoMaxAggregateInputType
  }

  export type GetLinkedin_infoAggregateType<T extends Linkedin_infoAggregateArgs> = {
        [P in keyof T & keyof AggregateLinkedin_info]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinkedin_info[P]>
      : GetScalarType<T[P], AggregateLinkedin_info[P]>
  }




  export type linkedin_infoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: linkedin_infoWhereInput
    orderBy?: linkedin_infoOrderByWithAggregationInput | linkedin_infoOrderByWithAggregationInput[]
    by: Linkedin_infoScalarFieldEnum[] | Linkedin_infoScalarFieldEnum
    having?: linkedin_infoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Linkedin_infoCountAggregateInputType | true
    _avg?: Linkedin_infoAvgAggregateInputType
    _sum?: Linkedin_infoSumAggregateInputType
    _min?: Linkedin_infoMinAggregateInputType
    _max?: Linkedin_infoMaxAggregateInputType
  }

  export type Linkedin_infoGroupByOutputType = {
    id: string
    company_id: string
    last_updated: Date
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date
    li_last_updated: Date
    type: string
    employees_count: number
    _count: Linkedin_infoCountAggregateOutputType | null
    _avg: Linkedin_infoAvgAggregateOutputType | null
    _sum: Linkedin_infoSumAggregateOutputType | null
    _min: Linkedin_infoMinAggregateOutputType | null
    _max: Linkedin_infoMaxAggregateOutputType | null
  }

  type GetLinkedin_infoGroupByPayload<T extends linkedin_infoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Linkedin_infoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Linkedin_infoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Linkedin_infoGroupByOutputType[P]>
            : GetScalarType<T[P], Linkedin_infoGroupByOutputType[P]>
        }
      >
    >


  export type linkedin_infoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    company_size?: boolean
    industry?: boolean
    description?: boolean
    linkedin_followers?: boolean
    founded?: boolean
    created?: boolean
    li_last_updated?: boolean
    type?: boolean
    employees_count?: boolean
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
    company_specialties_collection?: boolean | linkedin_info$company_specialties_collectionArgs<ExtArgs>
    company_featured_employees_collection?: boolean | linkedin_info$company_featured_employees_collectionArgs<ExtArgs>
    locations_collection?: boolean | linkedin_info$locations_collectionArgs<ExtArgs>
    _count?: boolean | Linkedin_infoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkedin_info"]>

  export type linkedin_infoSelectScalar = {
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    company_size?: boolean
    industry?: boolean
    description?: boolean
    linkedin_followers?: boolean
    founded?: boolean
    created?: boolean
    li_last_updated?: boolean
    type?: boolean
    employees_count?: boolean
  }

  export type linkedin_infoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
    company_specialties_collection?: boolean | linkedin_info$company_specialties_collectionArgs<ExtArgs>
    company_featured_employees_collection?: boolean | linkedin_info$company_featured_employees_collectionArgs<ExtArgs>
    locations_collection?: boolean | linkedin_info$locations_collectionArgs<ExtArgs>
    _count?: boolean | Linkedin_infoCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $linkedin_infoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "linkedin_info"
    objects: {
      vendor_company: Prisma.$vendor_companiesPayload<ExtArgs>
      company_specialties_collection: Prisma.$company_specialtiesPayload<ExtArgs>[]
      company_featured_employees_collection: Prisma.$featured_employeesPayload<ExtArgs>[]
      locations_collection: Prisma.$locationsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetResult<{
      id: string
      company_id: string
      last_updated: Date
      company_size: string
      industry: string
      description: string
      linkedin_followers: number
      founded: number
      created: Date
      li_last_updated: Date
      type: string
      employees_count: number
    }, ExtArgs["result"]["linkedin_info"]>
    composites: {}
  }


  type linkedin_infoGetPayload<S extends boolean | null | undefined | linkedin_infoDefaultArgs> = $Result.GetResult<Prisma.$linkedin_infoPayload, S>

  type linkedin_infoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<linkedin_infoFindManyArgs, 'select' | 'include'> & {
      select?: Linkedin_infoCountAggregateInputType | true
    }

  export interface linkedin_infoDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['linkedin_info'], meta: { name: 'linkedin_info' } }
    /**
     * Find zero or one Linkedin_info that matches the filter.
     * @param {linkedin_infoFindUniqueArgs} args - Arguments to find a Linkedin_info
     * @example
     * // Get one Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends linkedin_infoFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoFindUniqueArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Linkedin_info that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {linkedin_infoFindUniqueOrThrowArgs} args - Arguments to find a Linkedin_info
     * @example
     * // Get one Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends linkedin_infoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Linkedin_info that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoFindFirstArgs} args - Arguments to find a Linkedin_info
     * @example
     * // Get one Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends linkedin_infoFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoFindFirstArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Linkedin_info that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoFindFirstOrThrowArgs} args - Arguments to find a Linkedin_info
     * @example
     * // Get one Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends linkedin_infoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Linkedin_infos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Linkedin_infos
     * const linkedin_infos = await prisma.linkedin_info.findMany()
     * 
     * // Get first 10 Linkedin_infos
     * const linkedin_infos = await prisma.linkedin_info.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linkedin_infoWithIdOnly = await prisma.linkedin_info.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends linkedin_infoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Linkedin_info.
     * @param {linkedin_infoCreateArgs} args - Arguments to create a Linkedin_info.
     * @example
     * // Create one Linkedin_info
     * const Linkedin_info = await prisma.linkedin_info.create({
     *   data: {
     *     // ... data to create a Linkedin_info
     *   }
     * })
     * 
    **/
    create<T extends linkedin_infoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoCreateArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Linkedin_infos.
     *     @param {linkedin_infoCreateManyArgs} args - Arguments to create many Linkedin_infos.
     *     @example
     *     // Create many Linkedin_infos
     *     const linkedin_info = await prisma.linkedin_info.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends linkedin_infoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Linkedin_info.
     * @param {linkedin_infoDeleteArgs} args - Arguments to delete one Linkedin_info.
     * @example
     * // Delete one Linkedin_info
     * const Linkedin_info = await prisma.linkedin_info.delete({
     *   where: {
     *     // ... filter to delete one Linkedin_info
     *   }
     * })
     * 
    **/
    delete<T extends linkedin_infoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoDeleteArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Linkedin_info.
     * @param {linkedin_infoUpdateArgs} args - Arguments to update one Linkedin_info.
     * @example
     * // Update one Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends linkedin_infoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoUpdateArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Linkedin_infos.
     * @param {linkedin_infoDeleteManyArgs} args - Arguments to filter Linkedin_infos to delete.
     * @example
     * // Delete a few Linkedin_infos
     * const { count } = await prisma.linkedin_info.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends linkedin_infoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, linkedin_infoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Linkedin_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Linkedin_infos
     * const linkedin_info = await prisma.linkedin_info.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends linkedin_infoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Linkedin_info.
     * @param {linkedin_infoUpsertArgs} args - Arguments to update or create a Linkedin_info.
     * @example
     * // Update or create a Linkedin_info
     * const linkedin_info = await prisma.linkedin_info.upsert({
     *   create: {
     *     // ... data to create a Linkedin_info
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Linkedin_info we want to update
     *   }
     * })
    **/
    upsert<T extends linkedin_infoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, linkedin_infoUpsertArgs<ExtArgs>>
    ): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Linkedin_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoCountArgs} args - Arguments to filter Linkedin_infos to count.
     * @example
     * // Count the number of Linkedin_infos
     * const count = await prisma.linkedin_info.count({
     *   where: {
     *     // ... the filter for the Linkedin_infos we want to count
     *   }
     * })
    **/
    count<T extends linkedin_infoCountArgs>(
      args?: Subset<T, linkedin_infoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Linkedin_infoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Linkedin_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Linkedin_infoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Linkedin_infoAggregateArgs>(args: Subset<T, Linkedin_infoAggregateArgs>): Prisma.PrismaPromise<GetLinkedin_infoAggregateType<T>>

    /**
     * Group by Linkedin_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {linkedin_infoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends linkedin_infoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: linkedin_infoGroupByArgs['orderBy'] }
        : { orderBy?: linkedin_infoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, linkedin_infoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinkedin_infoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the linkedin_info model
   */
  readonly fields: linkedin_infoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for linkedin_info.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__linkedin_infoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vendor_company<T extends vendor_companiesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companiesDefaultArgs<ExtArgs>>): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    company_specialties_collection<T extends linkedin_info$company_specialties_collectionArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_info$company_specialties_collectionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findMany'> | Null>;

    company_featured_employees_collection<T extends linkedin_info$company_featured_employees_collectionArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_info$company_featured_employees_collectionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findMany'> | Null>;

    locations_collection<T extends linkedin_info$locations_collectionArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_info$locations_collectionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the linkedin_info model
   */ 
  interface linkedin_infoFieldRefs {
    readonly id: FieldRef<"linkedin_info", 'String'>
    readonly company_id: FieldRef<"linkedin_info", 'String'>
    readonly last_updated: FieldRef<"linkedin_info", 'DateTime'>
    readonly company_size: FieldRef<"linkedin_info", 'String'>
    readonly industry: FieldRef<"linkedin_info", 'String'>
    readonly description: FieldRef<"linkedin_info", 'String'>
    readonly linkedin_followers: FieldRef<"linkedin_info", 'Int'>
    readonly founded: FieldRef<"linkedin_info", 'Int'>
    readonly created: FieldRef<"linkedin_info", 'DateTime'>
    readonly li_last_updated: FieldRef<"linkedin_info", 'DateTime'>
    readonly type: FieldRef<"linkedin_info", 'String'>
    readonly employees_count: FieldRef<"linkedin_info", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * linkedin_info findUnique
   */
  export type linkedin_infoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter, which linkedin_info to fetch.
     */
    where: linkedin_infoWhereUniqueInput
  }


  /**
   * linkedin_info findUniqueOrThrow
   */
  export type linkedin_infoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter, which linkedin_info to fetch.
     */
    where: linkedin_infoWhereUniqueInput
  }


  /**
   * linkedin_info findFirst
   */
  export type linkedin_infoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter, which linkedin_info to fetch.
     */
    where?: linkedin_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of linkedin_infos to fetch.
     */
    orderBy?: linkedin_infoOrderByWithRelationInput | linkedin_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for linkedin_infos.
     */
    cursor?: linkedin_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` linkedin_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` linkedin_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of linkedin_infos.
     */
    distinct?: Linkedin_infoScalarFieldEnum | Linkedin_infoScalarFieldEnum[]
  }


  /**
   * linkedin_info findFirstOrThrow
   */
  export type linkedin_infoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter, which linkedin_info to fetch.
     */
    where?: linkedin_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of linkedin_infos to fetch.
     */
    orderBy?: linkedin_infoOrderByWithRelationInput | linkedin_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for linkedin_infos.
     */
    cursor?: linkedin_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` linkedin_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` linkedin_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of linkedin_infos.
     */
    distinct?: Linkedin_infoScalarFieldEnum | Linkedin_infoScalarFieldEnum[]
  }


  /**
   * linkedin_info findMany
   */
  export type linkedin_infoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter, which linkedin_infos to fetch.
     */
    where?: linkedin_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of linkedin_infos to fetch.
     */
    orderBy?: linkedin_infoOrderByWithRelationInput | linkedin_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing linkedin_infos.
     */
    cursor?: linkedin_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` linkedin_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` linkedin_infos.
     */
    skip?: number
    distinct?: Linkedin_infoScalarFieldEnum | Linkedin_infoScalarFieldEnum[]
  }


  /**
   * linkedin_info create
   */
  export type linkedin_infoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * The data needed to create a linkedin_info.
     */
    data: XOR<linkedin_infoCreateInput, linkedin_infoUncheckedCreateInput>
  }


  /**
   * linkedin_info createMany
   */
  export type linkedin_infoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many linkedin_infos.
     */
    data: linkedin_infoCreateManyInput | linkedin_infoCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * linkedin_info update
   */
  export type linkedin_infoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * The data needed to update a linkedin_info.
     */
    data: XOR<linkedin_infoUpdateInput, linkedin_infoUncheckedUpdateInput>
    /**
     * Choose, which linkedin_info to update.
     */
    where: linkedin_infoWhereUniqueInput
  }


  /**
   * linkedin_info updateMany
   */
  export type linkedin_infoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update linkedin_infos.
     */
    data: XOR<linkedin_infoUpdateManyMutationInput, linkedin_infoUncheckedUpdateManyInput>
    /**
     * Filter which linkedin_infos to update
     */
    where?: linkedin_infoWhereInput
  }


  /**
   * linkedin_info upsert
   */
  export type linkedin_infoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * The filter to search for the linkedin_info to update in case it exists.
     */
    where: linkedin_infoWhereUniqueInput
    /**
     * In case the linkedin_info found by the `where` argument doesn't exist, create a new linkedin_info with this data.
     */
    create: XOR<linkedin_infoCreateInput, linkedin_infoUncheckedCreateInput>
    /**
     * In case the linkedin_info was found with the provided `where` argument, update it with this data.
     */
    update: XOR<linkedin_infoUpdateInput, linkedin_infoUncheckedUpdateInput>
  }


  /**
   * linkedin_info delete
   */
  export type linkedin_infoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
    /**
     * Filter which linkedin_info to delete.
     */
    where: linkedin_infoWhereUniqueInput
  }


  /**
   * linkedin_info deleteMany
   */
  export type linkedin_infoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which linkedin_infos to delete
     */
    where?: linkedin_infoWhereInput
  }


  /**
   * linkedin_info.company_specialties_collection
   */
  export type linkedin_info$company_specialties_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    where?: company_specialtiesWhereInput
    orderBy?: company_specialtiesOrderByWithRelationInput | company_specialtiesOrderByWithRelationInput[]
    cursor?: company_specialtiesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Company_specialtiesScalarFieldEnum | Company_specialtiesScalarFieldEnum[]
  }


  /**
   * linkedin_info.company_featured_employees_collection
   */
  export type linkedin_info$company_featured_employees_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    where?: featured_employeesWhereInput
    orderBy?: featured_employeesOrderByWithRelationInput | featured_employeesOrderByWithRelationInput[]
    cursor?: featured_employeesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Featured_employeesScalarFieldEnum | Featured_employeesScalarFieldEnum[]
  }


  /**
   * linkedin_info.locations_collection
   */
  export type linkedin_info$locations_collectionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    where?: locationsWhereInput
    orderBy?: locationsOrderByWithRelationInput | locationsOrderByWithRelationInput[]
    cursor?: locationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationsScalarFieldEnum | LocationsScalarFieldEnum[]
  }


  /**
   * linkedin_info without action
   */
  export type linkedin_infoDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the linkedin_info
     */
    select?: linkedin_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: linkedin_infoInclude<ExtArgs> | null
  }



  /**
   * Model company_specialties
   */

  export type AggregateCompany_specialties = {
    _count: Company_specialtiesCountAggregateOutputType | null
    _min: Company_specialtiesMinAggregateOutputType | null
    _max: Company_specialtiesMaxAggregateOutputType | null
  }

  export type Company_specialtiesMinAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    specialty: string | null
  }

  export type Company_specialtiesMaxAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    specialty: string | null
  }

  export type Company_specialtiesCountAggregateOutputType = {
    id: number
    linkedin_info_id: number
    specialty: number
    _all: number
  }


  export type Company_specialtiesMinAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    specialty?: true
  }

  export type Company_specialtiesMaxAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    specialty?: true
  }

  export type Company_specialtiesCountAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    specialty?: true
    _all?: true
  }

  export type Company_specialtiesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which company_specialties to aggregate.
     */
    where?: company_specialtiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of company_specialties to fetch.
     */
    orderBy?: company_specialtiesOrderByWithRelationInput | company_specialtiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: company_specialtiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` company_specialties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` company_specialties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned company_specialties
    **/
    _count?: true | Company_specialtiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Company_specialtiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Company_specialtiesMaxAggregateInputType
  }

  export type GetCompany_specialtiesAggregateType<T extends Company_specialtiesAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany_specialties]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany_specialties[P]>
      : GetScalarType<T[P], AggregateCompany_specialties[P]>
  }




  export type company_specialtiesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: company_specialtiesWhereInput
    orderBy?: company_specialtiesOrderByWithAggregationInput | company_specialtiesOrderByWithAggregationInput[]
    by: Company_specialtiesScalarFieldEnum[] | Company_specialtiesScalarFieldEnum
    having?: company_specialtiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Company_specialtiesCountAggregateInputType | true
    _min?: Company_specialtiesMinAggregateInputType
    _max?: Company_specialtiesMaxAggregateInputType
  }

  export type Company_specialtiesGroupByOutputType = {
    id: string
    linkedin_info_id: string
    specialty: string
    _count: Company_specialtiesCountAggregateOutputType | null
    _min: Company_specialtiesMinAggregateOutputType | null
    _max: Company_specialtiesMaxAggregateOutputType | null
  }

  type GetCompany_specialtiesGroupByPayload<T extends company_specialtiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Company_specialtiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Company_specialtiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Company_specialtiesGroupByOutputType[P]>
            : GetScalarType<T[P], Company_specialtiesGroupByOutputType[P]>
        }
      >
    >


  export type company_specialtiesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkedin_info_id?: boolean
    specialty?: boolean
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company_specialties"]>

  export type company_specialtiesSelectScalar = {
    id?: boolean
    linkedin_info_id?: boolean
    specialty?: boolean
  }

  export type company_specialtiesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }


  export type $company_specialtiesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "company_specialties"
    objects: {
      linkedin_info: Prisma.$linkedin_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      linkedin_info_id: string
      specialty: string
    }, ExtArgs["result"]["company_specialties"]>
    composites: {}
  }


  type company_specialtiesGetPayload<S extends boolean | null | undefined | company_specialtiesDefaultArgs> = $Result.GetResult<Prisma.$company_specialtiesPayload, S>

  type company_specialtiesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<company_specialtiesFindManyArgs, 'select' | 'include'> & {
      select?: Company_specialtiesCountAggregateInputType | true
    }

  export interface company_specialtiesDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['company_specialties'], meta: { name: 'company_specialties' } }
    /**
     * Find zero or one Company_specialties that matches the filter.
     * @param {company_specialtiesFindUniqueArgs} args - Arguments to find a Company_specialties
     * @example
     * // Get one Company_specialties
     * const company_specialties = await prisma.company_specialties.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends company_specialtiesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesFindUniqueArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Company_specialties that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {company_specialtiesFindUniqueOrThrowArgs} args - Arguments to find a Company_specialties
     * @example
     * // Get one Company_specialties
     * const company_specialties = await prisma.company_specialties.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends company_specialtiesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Company_specialties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesFindFirstArgs} args - Arguments to find a Company_specialties
     * @example
     * // Get one Company_specialties
     * const company_specialties = await prisma.company_specialties.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends company_specialtiesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesFindFirstArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Company_specialties that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesFindFirstOrThrowArgs} args - Arguments to find a Company_specialties
     * @example
     * // Get one Company_specialties
     * const company_specialties = await prisma.company_specialties.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends company_specialtiesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Company_specialties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Company_specialties
     * const company_specialties = await prisma.company_specialties.findMany()
     * 
     * // Get first 10 Company_specialties
     * const company_specialties = await prisma.company_specialties.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const company_specialtiesWithIdOnly = await prisma.company_specialties.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends company_specialtiesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Company_specialties.
     * @param {company_specialtiesCreateArgs} args - Arguments to create a Company_specialties.
     * @example
     * // Create one Company_specialties
     * const Company_specialties = await prisma.company_specialties.create({
     *   data: {
     *     // ... data to create a Company_specialties
     *   }
     * })
     * 
    **/
    create<T extends company_specialtiesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesCreateArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Company_specialties.
     *     @param {company_specialtiesCreateManyArgs} args - Arguments to create many Company_specialties.
     *     @example
     *     // Create many Company_specialties
     *     const company_specialties = await prisma.company_specialties.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends company_specialtiesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Company_specialties.
     * @param {company_specialtiesDeleteArgs} args - Arguments to delete one Company_specialties.
     * @example
     * // Delete one Company_specialties
     * const Company_specialties = await prisma.company_specialties.delete({
     *   where: {
     *     // ... filter to delete one Company_specialties
     *   }
     * })
     * 
    **/
    delete<T extends company_specialtiesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesDeleteArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Company_specialties.
     * @param {company_specialtiesUpdateArgs} args - Arguments to update one Company_specialties.
     * @example
     * // Update one Company_specialties
     * const company_specialties = await prisma.company_specialties.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends company_specialtiesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesUpdateArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Company_specialties.
     * @param {company_specialtiesDeleteManyArgs} args - Arguments to filter Company_specialties to delete.
     * @example
     * // Delete a few Company_specialties
     * const { count } = await prisma.company_specialties.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends company_specialtiesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, company_specialtiesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Company_specialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Company_specialties
     * const company_specialties = await prisma.company_specialties.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends company_specialtiesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company_specialties.
     * @param {company_specialtiesUpsertArgs} args - Arguments to update or create a Company_specialties.
     * @example
     * // Update or create a Company_specialties
     * const company_specialties = await prisma.company_specialties.upsert({
     *   create: {
     *     // ... data to create a Company_specialties
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company_specialties we want to update
     *   }
     * })
    **/
    upsert<T extends company_specialtiesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, company_specialtiesUpsertArgs<ExtArgs>>
    ): Prisma__company_specialtiesClient<$Result.GetResult<Prisma.$company_specialtiesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Company_specialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesCountArgs} args - Arguments to filter Company_specialties to count.
     * @example
     * // Count the number of Company_specialties
     * const count = await prisma.company_specialties.count({
     *   where: {
     *     // ... the filter for the Company_specialties we want to count
     *   }
     * })
    **/
    count<T extends company_specialtiesCountArgs>(
      args?: Subset<T, company_specialtiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Company_specialtiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company_specialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Company_specialtiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Company_specialtiesAggregateArgs>(args: Subset<T, Company_specialtiesAggregateArgs>): Prisma.PrismaPromise<GetCompany_specialtiesAggregateType<T>>

    /**
     * Group by Company_specialties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {company_specialtiesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends company_specialtiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: company_specialtiesGroupByArgs['orderBy'] }
        : { orderBy?: company_specialtiesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, company_specialtiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompany_specialtiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the company_specialties model
   */
  readonly fields: company_specialtiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for company_specialties.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__company_specialtiesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    linkedin_info<T extends linkedin_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_infoDefaultArgs<ExtArgs>>): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the company_specialties model
   */ 
  interface company_specialtiesFieldRefs {
    readonly id: FieldRef<"company_specialties", 'String'>
    readonly linkedin_info_id: FieldRef<"company_specialties", 'String'>
    readonly specialty: FieldRef<"company_specialties", 'String'>
  }
    

  // Custom InputTypes

  /**
   * company_specialties findUnique
   */
  export type company_specialtiesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter, which company_specialties to fetch.
     */
    where: company_specialtiesWhereUniqueInput
  }


  /**
   * company_specialties findUniqueOrThrow
   */
  export type company_specialtiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter, which company_specialties to fetch.
     */
    where: company_specialtiesWhereUniqueInput
  }


  /**
   * company_specialties findFirst
   */
  export type company_specialtiesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter, which company_specialties to fetch.
     */
    where?: company_specialtiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of company_specialties to fetch.
     */
    orderBy?: company_specialtiesOrderByWithRelationInput | company_specialtiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for company_specialties.
     */
    cursor?: company_specialtiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` company_specialties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` company_specialties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of company_specialties.
     */
    distinct?: Company_specialtiesScalarFieldEnum | Company_specialtiesScalarFieldEnum[]
  }


  /**
   * company_specialties findFirstOrThrow
   */
  export type company_specialtiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter, which company_specialties to fetch.
     */
    where?: company_specialtiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of company_specialties to fetch.
     */
    orderBy?: company_specialtiesOrderByWithRelationInput | company_specialtiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for company_specialties.
     */
    cursor?: company_specialtiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` company_specialties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` company_specialties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of company_specialties.
     */
    distinct?: Company_specialtiesScalarFieldEnum | Company_specialtiesScalarFieldEnum[]
  }


  /**
   * company_specialties findMany
   */
  export type company_specialtiesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter, which company_specialties to fetch.
     */
    where?: company_specialtiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of company_specialties to fetch.
     */
    orderBy?: company_specialtiesOrderByWithRelationInput | company_specialtiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing company_specialties.
     */
    cursor?: company_specialtiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` company_specialties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` company_specialties.
     */
    skip?: number
    distinct?: Company_specialtiesScalarFieldEnum | Company_specialtiesScalarFieldEnum[]
  }


  /**
   * company_specialties create
   */
  export type company_specialtiesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * The data needed to create a company_specialties.
     */
    data: XOR<company_specialtiesCreateInput, company_specialtiesUncheckedCreateInput>
  }


  /**
   * company_specialties createMany
   */
  export type company_specialtiesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many company_specialties.
     */
    data: company_specialtiesCreateManyInput | company_specialtiesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * company_specialties update
   */
  export type company_specialtiesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * The data needed to update a company_specialties.
     */
    data: XOR<company_specialtiesUpdateInput, company_specialtiesUncheckedUpdateInput>
    /**
     * Choose, which company_specialties to update.
     */
    where: company_specialtiesWhereUniqueInput
  }


  /**
   * company_specialties updateMany
   */
  export type company_specialtiesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update company_specialties.
     */
    data: XOR<company_specialtiesUpdateManyMutationInput, company_specialtiesUncheckedUpdateManyInput>
    /**
     * Filter which company_specialties to update
     */
    where?: company_specialtiesWhereInput
  }


  /**
   * company_specialties upsert
   */
  export type company_specialtiesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * The filter to search for the company_specialties to update in case it exists.
     */
    where: company_specialtiesWhereUniqueInput
    /**
     * In case the company_specialties found by the `where` argument doesn't exist, create a new company_specialties with this data.
     */
    create: XOR<company_specialtiesCreateInput, company_specialtiesUncheckedCreateInput>
    /**
     * In case the company_specialties was found with the provided `where` argument, update it with this data.
     */
    update: XOR<company_specialtiesUpdateInput, company_specialtiesUncheckedUpdateInput>
  }


  /**
   * company_specialties delete
   */
  export type company_specialtiesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
    /**
     * Filter which company_specialties to delete.
     */
    where: company_specialtiesWhereUniqueInput
  }


  /**
   * company_specialties deleteMany
   */
  export type company_specialtiesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which company_specialties to delete
     */
    where?: company_specialtiesWhereInput
  }


  /**
   * company_specialties without action
   */
  export type company_specialtiesDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the company_specialties
     */
    select?: company_specialtiesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: company_specialtiesInclude<ExtArgs> | null
  }



  /**
   * Model featured_employees
   */

  export type AggregateFeatured_employees = {
    _count: Featured_employeesCountAggregateOutputType | null
    _min: Featured_employeesMinAggregateOutputType | null
    _max: Featured_employeesMaxAggregateOutputType | null
  }

  export type Featured_employeesMinAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    linkedin_url: string | null
  }

  export type Featured_employeesMaxAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    linkedin_url: string | null
  }

  export type Featured_employeesCountAggregateOutputType = {
    id: number
    linkedin_info_id: number
    linkedin_url: number
    _all: number
  }


  export type Featured_employeesMinAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    linkedin_url?: true
  }

  export type Featured_employeesMaxAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    linkedin_url?: true
  }

  export type Featured_employeesCountAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    linkedin_url?: true
    _all?: true
  }

  export type Featured_employeesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which featured_employees to aggregate.
     */
    where?: featured_employeesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of featured_employees to fetch.
     */
    orderBy?: featured_employeesOrderByWithRelationInput | featured_employeesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: featured_employeesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` featured_employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` featured_employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned featured_employees
    **/
    _count?: true | Featured_employeesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Featured_employeesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Featured_employeesMaxAggregateInputType
  }

  export type GetFeatured_employeesAggregateType<T extends Featured_employeesAggregateArgs> = {
        [P in keyof T & keyof AggregateFeatured_employees]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeatured_employees[P]>
      : GetScalarType<T[P], AggregateFeatured_employees[P]>
  }




  export type featured_employeesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: featured_employeesWhereInput
    orderBy?: featured_employeesOrderByWithAggregationInput | featured_employeesOrderByWithAggregationInput[]
    by: Featured_employeesScalarFieldEnum[] | Featured_employeesScalarFieldEnum
    having?: featured_employeesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Featured_employeesCountAggregateInputType | true
    _min?: Featured_employeesMinAggregateInputType
    _max?: Featured_employeesMaxAggregateInputType
  }

  export type Featured_employeesGroupByOutputType = {
    id: string
    linkedin_info_id: string
    linkedin_url: string
    _count: Featured_employeesCountAggregateOutputType | null
    _min: Featured_employeesMinAggregateOutputType | null
    _max: Featured_employeesMaxAggregateOutputType | null
  }

  type GetFeatured_employeesGroupByPayload<T extends featured_employeesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Featured_employeesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Featured_employeesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Featured_employeesGroupByOutputType[P]>
            : GetScalarType<T[P], Featured_employeesGroupByOutputType[P]>
        }
      >
    >


  export type featured_employeesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkedin_info_id?: boolean
    linkedin_url?: boolean
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["featured_employees"]>

  export type featured_employeesSelectScalar = {
    id?: boolean
    linkedin_info_id?: boolean
    linkedin_url?: boolean
  }

  export type featured_employeesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }


  export type $featured_employeesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "featured_employees"
    objects: {
      linkedin_info: Prisma.$linkedin_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      linkedin_info_id: string
      linkedin_url: string
    }, ExtArgs["result"]["featured_employees"]>
    composites: {}
  }


  type featured_employeesGetPayload<S extends boolean | null | undefined | featured_employeesDefaultArgs> = $Result.GetResult<Prisma.$featured_employeesPayload, S>

  type featured_employeesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<featured_employeesFindManyArgs, 'select' | 'include'> & {
      select?: Featured_employeesCountAggregateInputType | true
    }

  export interface featured_employeesDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['featured_employees'], meta: { name: 'featured_employees' } }
    /**
     * Find zero or one Featured_employees that matches the filter.
     * @param {featured_employeesFindUniqueArgs} args - Arguments to find a Featured_employees
     * @example
     * // Get one Featured_employees
     * const featured_employees = await prisma.featured_employees.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends featured_employeesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesFindUniqueArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Featured_employees that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {featured_employeesFindUniqueOrThrowArgs} args - Arguments to find a Featured_employees
     * @example
     * // Get one Featured_employees
     * const featured_employees = await prisma.featured_employees.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends featured_employeesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Featured_employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesFindFirstArgs} args - Arguments to find a Featured_employees
     * @example
     * // Get one Featured_employees
     * const featured_employees = await prisma.featured_employees.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends featured_employeesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesFindFirstArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Featured_employees that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesFindFirstOrThrowArgs} args - Arguments to find a Featured_employees
     * @example
     * // Get one Featured_employees
     * const featured_employees = await prisma.featured_employees.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends featured_employeesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Featured_employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Featured_employees
     * const featured_employees = await prisma.featured_employees.findMany()
     * 
     * // Get first 10 Featured_employees
     * const featured_employees = await prisma.featured_employees.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const featured_employeesWithIdOnly = await prisma.featured_employees.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends featured_employeesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Featured_employees.
     * @param {featured_employeesCreateArgs} args - Arguments to create a Featured_employees.
     * @example
     * // Create one Featured_employees
     * const Featured_employees = await prisma.featured_employees.create({
     *   data: {
     *     // ... data to create a Featured_employees
     *   }
     * })
     * 
    **/
    create<T extends featured_employeesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesCreateArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Featured_employees.
     *     @param {featured_employeesCreateManyArgs} args - Arguments to create many Featured_employees.
     *     @example
     *     // Create many Featured_employees
     *     const featured_employees = await prisma.featured_employees.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends featured_employeesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Featured_employees.
     * @param {featured_employeesDeleteArgs} args - Arguments to delete one Featured_employees.
     * @example
     * // Delete one Featured_employees
     * const Featured_employees = await prisma.featured_employees.delete({
     *   where: {
     *     // ... filter to delete one Featured_employees
     *   }
     * })
     * 
    **/
    delete<T extends featured_employeesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesDeleteArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Featured_employees.
     * @param {featured_employeesUpdateArgs} args - Arguments to update one Featured_employees.
     * @example
     * // Update one Featured_employees
     * const featured_employees = await prisma.featured_employees.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends featured_employeesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesUpdateArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Featured_employees.
     * @param {featured_employeesDeleteManyArgs} args - Arguments to filter Featured_employees to delete.
     * @example
     * // Delete a few Featured_employees
     * const { count } = await prisma.featured_employees.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends featured_employeesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, featured_employeesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Featured_employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Featured_employees
     * const featured_employees = await prisma.featured_employees.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends featured_employeesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Featured_employees.
     * @param {featured_employeesUpsertArgs} args - Arguments to update or create a Featured_employees.
     * @example
     * // Update or create a Featured_employees
     * const featured_employees = await prisma.featured_employees.upsert({
     *   create: {
     *     // ... data to create a Featured_employees
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Featured_employees we want to update
     *   }
     * })
    **/
    upsert<T extends featured_employeesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, featured_employeesUpsertArgs<ExtArgs>>
    ): Prisma__featured_employeesClient<$Result.GetResult<Prisma.$featured_employeesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Featured_employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesCountArgs} args - Arguments to filter Featured_employees to count.
     * @example
     * // Count the number of Featured_employees
     * const count = await prisma.featured_employees.count({
     *   where: {
     *     // ... the filter for the Featured_employees we want to count
     *   }
     * })
    **/
    count<T extends featured_employeesCountArgs>(
      args?: Subset<T, featured_employeesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Featured_employeesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Featured_employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Featured_employeesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Featured_employeesAggregateArgs>(args: Subset<T, Featured_employeesAggregateArgs>): Prisma.PrismaPromise<GetFeatured_employeesAggregateType<T>>

    /**
     * Group by Featured_employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {featured_employeesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends featured_employeesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: featured_employeesGroupByArgs['orderBy'] }
        : { orderBy?: featured_employeesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, featured_employeesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeatured_employeesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the featured_employees model
   */
  readonly fields: featured_employeesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for featured_employees.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__featured_employeesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    linkedin_info<T extends linkedin_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_infoDefaultArgs<ExtArgs>>): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the featured_employees model
   */ 
  interface featured_employeesFieldRefs {
    readonly id: FieldRef<"featured_employees", 'String'>
    readonly linkedin_info_id: FieldRef<"featured_employees", 'String'>
    readonly linkedin_url: FieldRef<"featured_employees", 'String'>
  }
    

  // Custom InputTypes

  /**
   * featured_employees findUnique
   */
  export type featured_employeesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter, which featured_employees to fetch.
     */
    where: featured_employeesWhereUniqueInput
  }


  /**
   * featured_employees findUniqueOrThrow
   */
  export type featured_employeesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter, which featured_employees to fetch.
     */
    where: featured_employeesWhereUniqueInput
  }


  /**
   * featured_employees findFirst
   */
  export type featured_employeesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter, which featured_employees to fetch.
     */
    where?: featured_employeesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of featured_employees to fetch.
     */
    orderBy?: featured_employeesOrderByWithRelationInput | featured_employeesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for featured_employees.
     */
    cursor?: featured_employeesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` featured_employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` featured_employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of featured_employees.
     */
    distinct?: Featured_employeesScalarFieldEnum | Featured_employeesScalarFieldEnum[]
  }


  /**
   * featured_employees findFirstOrThrow
   */
  export type featured_employeesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter, which featured_employees to fetch.
     */
    where?: featured_employeesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of featured_employees to fetch.
     */
    orderBy?: featured_employeesOrderByWithRelationInput | featured_employeesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for featured_employees.
     */
    cursor?: featured_employeesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` featured_employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` featured_employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of featured_employees.
     */
    distinct?: Featured_employeesScalarFieldEnum | Featured_employeesScalarFieldEnum[]
  }


  /**
   * featured_employees findMany
   */
  export type featured_employeesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter, which featured_employees to fetch.
     */
    where?: featured_employeesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of featured_employees to fetch.
     */
    orderBy?: featured_employeesOrderByWithRelationInput | featured_employeesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing featured_employees.
     */
    cursor?: featured_employeesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` featured_employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` featured_employees.
     */
    skip?: number
    distinct?: Featured_employeesScalarFieldEnum | Featured_employeesScalarFieldEnum[]
  }


  /**
   * featured_employees create
   */
  export type featured_employeesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * The data needed to create a featured_employees.
     */
    data: XOR<featured_employeesCreateInput, featured_employeesUncheckedCreateInput>
  }


  /**
   * featured_employees createMany
   */
  export type featured_employeesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many featured_employees.
     */
    data: featured_employeesCreateManyInput | featured_employeesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * featured_employees update
   */
  export type featured_employeesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * The data needed to update a featured_employees.
     */
    data: XOR<featured_employeesUpdateInput, featured_employeesUncheckedUpdateInput>
    /**
     * Choose, which featured_employees to update.
     */
    where: featured_employeesWhereUniqueInput
  }


  /**
   * featured_employees updateMany
   */
  export type featured_employeesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update featured_employees.
     */
    data: XOR<featured_employeesUpdateManyMutationInput, featured_employeesUncheckedUpdateManyInput>
    /**
     * Filter which featured_employees to update
     */
    where?: featured_employeesWhereInput
  }


  /**
   * featured_employees upsert
   */
  export type featured_employeesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * The filter to search for the featured_employees to update in case it exists.
     */
    where: featured_employeesWhereUniqueInput
    /**
     * In case the featured_employees found by the `where` argument doesn't exist, create a new featured_employees with this data.
     */
    create: XOR<featured_employeesCreateInput, featured_employeesUncheckedCreateInput>
    /**
     * In case the featured_employees was found with the provided `where` argument, update it with this data.
     */
    update: XOR<featured_employeesUpdateInput, featured_employeesUncheckedUpdateInput>
  }


  /**
   * featured_employees delete
   */
  export type featured_employeesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
    /**
     * Filter which featured_employees to delete.
     */
    where: featured_employeesWhereUniqueInput
  }


  /**
   * featured_employees deleteMany
   */
  export type featured_employeesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which featured_employees to delete
     */
    where?: featured_employeesWhereInput
  }


  /**
   * featured_employees without action
   */
  export type featured_employeesDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the featured_employees
     */
    select?: featured_employeesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: featured_employeesInclude<ExtArgs> | null
  }



  /**
   * Model locations
   */

  export type AggregateLocations = {
    _count: LocationsCountAggregateOutputType | null
    _min: LocationsMinAggregateOutputType | null
    _max: LocationsMaxAggregateOutputType | null
  }

  export type LocationsMinAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    location_address: string | null
  }

  export type LocationsMaxAggregateOutputType = {
    id: string | null
    linkedin_info_id: string | null
    location_address: string | null
  }

  export type LocationsCountAggregateOutputType = {
    id: number
    linkedin_info_id: number
    location_address: number
    _all: number
  }


  export type LocationsMinAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    location_address?: true
  }

  export type LocationsMaxAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    location_address?: true
  }

  export type LocationsCountAggregateInputType = {
    id?: true
    linkedin_info_id?: true
    location_address?: true
    _all?: true
  }

  export type LocationsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which locations to aggregate.
     */
    where?: locationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of locations to fetch.
     */
    orderBy?: locationsOrderByWithRelationInput | locationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: locationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned locations
    **/
    _count?: true | LocationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationsMaxAggregateInputType
  }

  export type GetLocationsAggregateType<T extends LocationsAggregateArgs> = {
        [P in keyof T & keyof AggregateLocations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocations[P]>
      : GetScalarType<T[P], AggregateLocations[P]>
  }




  export type locationsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: locationsWhereInput
    orderBy?: locationsOrderByWithAggregationInput | locationsOrderByWithAggregationInput[]
    by: LocationsScalarFieldEnum[] | LocationsScalarFieldEnum
    having?: locationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationsCountAggregateInputType | true
    _min?: LocationsMinAggregateInputType
    _max?: LocationsMaxAggregateInputType
  }

  export type LocationsGroupByOutputType = {
    id: string
    linkedin_info_id: string
    location_address: string
    _count: LocationsCountAggregateOutputType | null
    _min: LocationsMinAggregateOutputType | null
    _max: LocationsMaxAggregateOutputType | null
  }

  type GetLocationsGroupByPayload<T extends locationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationsGroupByOutputType[P]>
            : GetScalarType<T[P], LocationsGroupByOutputType[P]>
        }
      >
    >


  export type locationsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkedin_info_id?: boolean
    location_address?: boolean
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locations"]>

  export type locationsSelectScalar = {
    id?: boolean
    linkedin_info_id?: boolean
    location_address?: boolean
  }

  export type locationsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    linkedin_info?: boolean | linkedin_infoDefaultArgs<ExtArgs>
  }


  export type $locationsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "locations"
    objects: {
      linkedin_info: Prisma.$linkedin_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      linkedin_info_id: string
      location_address: string
    }, ExtArgs["result"]["locations"]>
    composites: {}
  }


  type locationsGetPayload<S extends boolean | null | undefined | locationsDefaultArgs> = $Result.GetResult<Prisma.$locationsPayload, S>

  type locationsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<locationsFindManyArgs, 'select' | 'include'> & {
      select?: LocationsCountAggregateInputType | true
    }

  export interface locationsDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['locations'], meta: { name: 'locations' } }
    /**
     * Find zero or one Locations that matches the filter.
     * @param {locationsFindUniqueArgs} args - Arguments to find a Locations
     * @example
     * // Get one Locations
     * const locations = await prisma.locations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends locationsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, locationsFindUniqueArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Locations that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {locationsFindUniqueOrThrowArgs} args - Arguments to find a Locations
     * @example
     * // Get one Locations
     * const locations = await prisma.locations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends locationsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsFindFirstArgs} args - Arguments to find a Locations
     * @example
     * // Get one Locations
     * const locations = await prisma.locations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends locationsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsFindFirstArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Locations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsFindFirstOrThrowArgs} args - Arguments to find a Locations
     * @example
     * // Get one Locations
     * const locations = await prisma.locations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends locationsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.locations.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.locations.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationsWithIdOnly = await prisma.locations.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends locationsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Locations.
     * @param {locationsCreateArgs} args - Arguments to create a Locations.
     * @example
     * // Create one Locations
     * const Locations = await prisma.locations.create({
     *   data: {
     *     // ... data to create a Locations
     *   }
     * })
     * 
    **/
    create<T extends locationsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, locationsCreateArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Locations.
     *     @param {locationsCreateManyArgs} args - Arguments to create many Locations.
     *     @example
     *     // Create many Locations
     *     const locations = await prisma.locations.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends locationsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Locations.
     * @param {locationsDeleteArgs} args - Arguments to delete one Locations.
     * @example
     * // Delete one Locations
     * const Locations = await prisma.locations.delete({
     *   where: {
     *     // ... filter to delete one Locations
     *   }
     * })
     * 
    **/
    delete<T extends locationsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, locationsDeleteArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Locations.
     * @param {locationsUpdateArgs} args - Arguments to update one Locations.
     * @example
     * // Update one Locations
     * const locations = await prisma.locations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends locationsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, locationsUpdateArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Locations.
     * @param {locationsDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.locations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends locationsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, locationsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const locations = await prisma.locations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends locationsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, locationsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Locations.
     * @param {locationsUpsertArgs} args - Arguments to update or create a Locations.
     * @example
     * // Update or create a Locations
     * const locations = await prisma.locations.upsert({
     *   create: {
     *     // ... data to create a Locations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Locations we want to update
     *   }
     * })
    **/
    upsert<T extends locationsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, locationsUpsertArgs<ExtArgs>>
    ): Prisma__locationsClient<$Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.locations.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends locationsCountArgs>(
      args?: Subset<T, locationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationsAggregateArgs>(args: Subset<T, LocationsAggregateArgs>): Prisma.PrismaPromise<GetLocationsAggregateType<T>>

    /**
     * Group by Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {locationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends locationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: locationsGroupByArgs['orderBy'] }
        : { orderBy?: locationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, locationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the locations model
   */
  readonly fields: locationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for locations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__locationsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    linkedin_info<T extends linkedin_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, linkedin_infoDefaultArgs<ExtArgs>>): Prisma__linkedin_infoClient<$Result.GetResult<Prisma.$linkedin_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the locations model
   */ 
  interface locationsFieldRefs {
    readonly id: FieldRef<"locations", 'String'>
    readonly linkedin_info_id: FieldRef<"locations", 'String'>
    readonly location_address: FieldRef<"locations", 'String'>
  }
    

  // Custom InputTypes

  /**
   * locations findUnique
   */
  export type locationsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter, which locations to fetch.
     */
    where: locationsWhereUniqueInput
  }


  /**
   * locations findUniqueOrThrow
   */
  export type locationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter, which locations to fetch.
     */
    where: locationsWhereUniqueInput
  }


  /**
   * locations findFirst
   */
  export type locationsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter, which locations to fetch.
     */
    where?: locationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of locations to fetch.
     */
    orderBy?: locationsOrderByWithRelationInput | locationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for locations.
     */
    cursor?: locationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of locations.
     */
    distinct?: LocationsScalarFieldEnum | LocationsScalarFieldEnum[]
  }


  /**
   * locations findFirstOrThrow
   */
  export type locationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter, which locations to fetch.
     */
    where?: locationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of locations to fetch.
     */
    orderBy?: locationsOrderByWithRelationInput | locationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for locations.
     */
    cursor?: locationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of locations.
     */
    distinct?: LocationsScalarFieldEnum | LocationsScalarFieldEnum[]
  }


  /**
   * locations findMany
   */
  export type locationsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter, which locations to fetch.
     */
    where?: locationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of locations to fetch.
     */
    orderBy?: locationsOrderByWithRelationInput | locationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing locations.
     */
    cursor?: locationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` locations.
     */
    skip?: number
    distinct?: LocationsScalarFieldEnum | LocationsScalarFieldEnum[]
  }


  /**
   * locations create
   */
  export type locationsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * The data needed to create a locations.
     */
    data: XOR<locationsCreateInput, locationsUncheckedCreateInput>
  }


  /**
   * locations createMany
   */
  export type locationsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many locations.
     */
    data: locationsCreateManyInput | locationsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * locations update
   */
  export type locationsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * The data needed to update a locations.
     */
    data: XOR<locationsUpdateInput, locationsUncheckedUpdateInput>
    /**
     * Choose, which locations to update.
     */
    where: locationsWhereUniqueInput
  }


  /**
   * locations updateMany
   */
  export type locationsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update locations.
     */
    data: XOR<locationsUpdateManyMutationInput, locationsUncheckedUpdateManyInput>
    /**
     * Filter which locations to update
     */
    where?: locationsWhereInput
  }


  /**
   * locations upsert
   */
  export type locationsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * The filter to search for the locations to update in case it exists.
     */
    where: locationsWhereUniqueInput
    /**
     * In case the locations found by the `where` argument doesn't exist, create a new locations with this data.
     */
    create: XOR<locationsCreateInput, locationsUncheckedCreateInput>
    /**
     * In case the locations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<locationsUpdateInput, locationsUncheckedUpdateInput>
  }


  /**
   * locations delete
   */
  export type locationsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
    /**
     * Filter which locations to delete.
     */
    where: locationsWhereUniqueInput
  }


  /**
   * locations deleteMany
   */
  export type locationsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which locations to delete
     */
    where?: locationsWhereInput
  }


  /**
   * locations without action
   */
  export type locationsDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the locations
     */
    select?: locationsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: locationsInclude<ExtArgs> | null
  }



  /**
   * Model funding_info
   */

  export type AggregateFunding_info = {
    _count: Funding_infoCountAggregateOutputType | null
    _avg: Funding_infoAvgAggregateOutputType | null
    _sum: Funding_infoSumAggregateOutputType | null
    _min: Funding_infoMinAggregateOutputType | null
    _max: Funding_infoMaxAggregateOutputType | null
  }

  export type Funding_infoAvgAggregateOutputType = {
    org_rank: number | null
    num_articles: number | null
  }

  export type Funding_infoSumAggregateOutputType = {
    org_rank: number | null
    num_articles: number | null
  }

  export type Funding_infoMinAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    company_img_url: string | null
    company_type: string | null
    ipo_status: string | null
    revenue_range: string | null
    org_rank: number | null
    num_articles: number | null
  }

  export type Funding_infoMaxAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
    company_img_url: string | null
    company_type: string | null
    ipo_status: string | null
    revenue_range: string | null
    org_rank: number | null
    num_articles: number | null
  }

  export type Funding_infoCountAggregateOutputType = {
    id: number
    company_id: number
    last_updated: number
    company_img_url: number
    company_type: number
    ipo_status: number
    revenue_range: number
    org_rank: number
    num_articles: number
    _all: number
  }


  export type Funding_infoAvgAggregateInputType = {
    org_rank?: true
    num_articles?: true
  }

  export type Funding_infoSumAggregateInputType = {
    org_rank?: true
    num_articles?: true
  }

  export type Funding_infoMinAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_img_url?: true
    company_type?: true
    ipo_status?: true
    revenue_range?: true
    org_rank?: true
    num_articles?: true
  }

  export type Funding_infoMaxAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_img_url?: true
    company_type?: true
    ipo_status?: true
    revenue_range?: true
    org_rank?: true
    num_articles?: true
  }

  export type Funding_infoCountAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    company_img_url?: true
    company_type?: true
    ipo_status?: true
    revenue_range?: true
    org_rank?: true
    num_articles?: true
    _all?: true
  }

  export type Funding_infoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which funding_info to aggregate.
     */
    where?: funding_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_infos to fetch.
     */
    orderBy?: funding_infoOrderByWithRelationInput | funding_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: funding_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned funding_infos
    **/
    _count?: true | Funding_infoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Funding_infoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Funding_infoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Funding_infoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Funding_infoMaxAggregateInputType
  }

  export type GetFunding_infoAggregateType<T extends Funding_infoAggregateArgs> = {
        [P in keyof T & keyof AggregateFunding_info]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFunding_info[P]>
      : GetScalarType<T[P], AggregateFunding_info[P]>
  }




  export type funding_infoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: funding_infoWhereInput
    orderBy?: funding_infoOrderByWithAggregationInput | funding_infoOrderByWithAggregationInput[]
    by: Funding_infoScalarFieldEnum[] | Funding_infoScalarFieldEnum
    having?: funding_infoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Funding_infoCountAggregateInputType | true
    _avg?: Funding_infoAvgAggregateInputType
    _sum?: Funding_infoSumAggregateInputType
    _min?: Funding_infoMinAggregateInputType
    _max?: Funding_infoMaxAggregateInputType
  }

  export type Funding_infoGroupByOutputType = {
    id: string
    company_id: string
    last_updated: Date
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    _count: Funding_infoCountAggregateOutputType | null
    _avg: Funding_infoAvgAggregateOutputType | null
    _sum: Funding_infoSumAggregateOutputType | null
    _min: Funding_infoMinAggregateOutputType | null
    _max: Funding_infoMaxAggregateOutputType | null
  }

  type GetFunding_infoGroupByPayload<T extends funding_infoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Funding_infoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Funding_infoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Funding_infoGroupByOutputType[P]>
            : GetScalarType<T[P], Funding_infoGroupByOutputType[P]>
        }
      >
    >


  export type funding_infoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    company_img_url?: boolean
    company_type?: boolean
    ipo_status?: boolean
    revenue_range?: boolean
    org_rank?: boolean
    num_articles?: boolean
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
    categories?: boolean | funding_info$categoriesArgs<ExtArgs>
    press_references?: boolean | funding_info$press_referencesArgs<ExtArgs>
    raised_funding_rounds?: boolean | funding_info$raised_funding_roundsArgs<ExtArgs>
    founders?: boolean | funding_info$foundersArgs<ExtArgs>
    _count?: boolean | Funding_infoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funding_info"]>

  export type funding_infoSelectScalar = {
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    company_img_url?: boolean
    company_type?: boolean
    ipo_status?: boolean
    revenue_range?: boolean
    org_rank?: boolean
    num_articles?: boolean
  }

  export type funding_infoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
    categories?: boolean | funding_info$categoriesArgs<ExtArgs>
    press_references?: boolean | funding_info$press_referencesArgs<ExtArgs>
    raised_funding_rounds?: boolean | funding_info$raised_funding_roundsArgs<ExtArgs>
    founders?: boolean | funding_info$foundersArgs<ExtArgs>
    _count?: boolean | Funding_infoCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $funding_infoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "funding_info"
    objects: {
      vendor_company: Prisma.$vendor_companiesPayload<ExtArgs>
      categories: Prisma.$categoriesPayload<ExtArgs>[]
      press_references: Prisma.$press_referencesPayload<ExtArgs>[]
      raised_funding_rounds: Prisma.$funding_roundsPayload<ExtArgs>[]
      founders: Prisma.$foundersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetResult<{
      id: string
      company_id: string
      last_updated: Date
      company_img_url: string
      company_type: string
      ipo_status: string
      revenue_range: string
      org_rank: number
      num_articles: number
    }, ExtArgs["result"]["funding_info"]>
    composites: {}
  }


  type funding_infoGetPayload<S extends boolean | null | undefined | funding_infoDefaultArgs> = $Result.GetResult<Prisma.$funding_infoPayload, S>

  type funding_infoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<funding_infoFindManyArgs, 'select' | 'include'> & {
      select?: Funding_infoCountAggregateInputType | true
    }

  export interface funding_infoDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['funding_info'], meta: { name: 'funding_info' } }
    /**
     * Find zero or one Funding_info that matches the filter.
     * @param {funding_infoFindUniqueArgs} args - Arguments to find a Funding_info
     * @example
     * // Get one Funding_info
     * const funding_info = await prisma.funding_info.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends funding_infoFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoFindUniqueArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Funding_info that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {funding_infoFindUniqueOrThrowArgs} args - Arguments to find a Funding_info
     * @example
     * // Get one Funding_info
     * const funding_info = await prisma.funding_info.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends funding_infoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Funding_info that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoFindFirstArgs} args - Arguments to find a Funding_info
     * @example
     * // Get one Funding_info
     * const funding_info = await prisma.funding_info.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends funding_infoFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoFindFirstArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Funding_info that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoFindFirstOrThrowArgs} args - Arguments to find a Funding_info
     * @example
     * // Get one Funding_info
     * const funding_info = await prisma.funding_info.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends funding_infoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Funding_infos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Funding_infos
     * const funding_infos = await prisma.funding_info.findMany()
     * 
     * // Get first 10 Funding_infos
     * const funding_infos = await prisma.funding_info.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const funding_infoWithIdOnly = await prisma.funding_info.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends funding_infoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Funding_info.
     * @param {funding_infoCreateArgs} args - Arguments to create a Funding_info.
     * @example
     * // Create one Funding_info
     * const Funding_info = await prisma.funding_info.create({
     *   data: {
     *     // ... data to create a Funding_info
     *   }
     * })
     * 
    **/
    create<T extends funding_infoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoCreateArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Funding_infos.
     *     @param {funding_infoCreateManyArgs} args - Arguments to create many Funding_infos.
     *     @example
     *     // Create many Funding_infos
     *     const funding_info = await prisma.funding_info.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends funding_infoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Funding_info.
     * @param {funding_infoDeleteArgs} args - Arguments to delete one Funding_info.
     * @example
     * // Delete one Funding_info
     * const Funding_info = await prisma.funding_info.delete({
     *   where: {
     *     // ... filter to delete one Funding_info
     *   }
     * })
     * 
    **/
    delete<T extends funding_infoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoDeleteArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Funding_info.
     * @param {funding_infoUpdateArgs} args - Arguments to update one Funding_info.
     * @example
     * // Update one Funding_info
     * const funding_info = await prisma.funding_info.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends funding_infoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoUpdateArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Funding_infos.
     * @param {funding_infoDeleteManyArgs} args - Arguments to filter Funding_infos to delete.
     * @example
     * // Delete a few Funding_infos
     * const { count } = await prisma.funding_info.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends funding_infoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_infoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Funding_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Funding_infos
     * const funding_info = await prisma.funding_info.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends funding_infoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Funding_info.
     * @param {funding_infoUpsertArgs} args - Arguments to update or create a Funding_info.
     * @example
     * // Update or create a Funding_info
     * const funding_info = await prisma.funding_info.upsert({
     *   create: {
     *     // ... data to create a Funding_info
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Funding_info we want to update
     *   }
     * })
    **/
    upsert<T extends funding_infoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, funding_infoUpsertArgs<ExtArgs>>
    ): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Funding_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoCountArgs} args - Arguments to filter Funding_infos to count.
     * @example
     * // Count the number of Funding_infos
     * const count = await prisma.funding_info.count({
     *   where: {
     *     // ... the filter for the Funding_infos we want to count
     *   }
     * })
    **/
    count<T extends funding_infoCountArgs>(
      args?: Subset<T, funding_infoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Funding_infoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Funding_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Funding_infoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Funding_infoAggregateArgs>(args: Subset<T, Funding_infoAggregateArgs>): Prisma.PrismaPromise<GetFunding_infoAggregateType<T>>

    /**
     * Group by Funding_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_infoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends funding_infoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: funding_infoGroupByArgs['orderBy'] }
        : { orderBy?: funding_infoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, funding_infoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFunding_infoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the funding_info model
   */
  readonly fields: funding_infoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for funding_info.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__funding_infoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vendor_company<T extends vendor_companiesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companiesDefaultArgs<ExtArgs>>): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    categories<T extends funding_info$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, funding_info$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findMany'> | Null>;

    press_references<T extends funding_info$press_referencesArgs<ExtArgs> = {}>(args?: Subset<T, funding_info$press_referencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findMany'> | Null>;

    raised_funding_rounds<T extends funding_info$raised_funding_roundsArgs<ExtArgs> = {}>(args?: Subset<T, funding_info$raised_funding_roundsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findMany'> | Null>;

    founders<T extends funding_info$foundersArgs<ExtArgs> = {}>(args?: Subset<T, funding_info$foundersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the funding_info model
   */ 
  interface funding_infoFieldRefs {
    readonly id: FieldRef<"funding_info", 'String'>
    readonly company_id: FieldRef<"funding_info", 'String'>
    readonly last_updated: FieldRef<"funding_info", 'DateTime'>
    readonly company_img_url: FieldRef<"funding_info", 'String'>
    readonly company_type: FieldRef<"funding_info", 'String'>
    readonly ipo_status: FieldRef<"funding_info", 'String'>
    readonly revenue_range: FieldRef<"funding_info", 'String'>
    readonly org_rank: FieldRef<"funding_info", 'Int'>
    readonly num_articles: FieldRef<"funding_info", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * funding_info findUnique
   */
  export type funding_infoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter, which funding_info to fetch.
     */
    where: funding_infoWhereUniqueInput
  }


  /**
   * funding_info findUniqueOrThrow
   */
  export type funding_infoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter, which funding_info to fetch.
     */
    where: funding_infoWhereUniqueInput
  }


  /**
   * funding_info findFirst
   */
  export type funding_infoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter, which funding_info to fetch.
     */
    where?: funding_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_infos to fetch.
     */
    orderBy?: funding_infoOrderByWithRelationInput | funding_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for funding_infos.
     */
    cursor?: funding_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of funding_infos.
     */
    distinct?: Funding_infoScalarFieldEnum | Funding_infoScalarFieldEnum[]
  }


  /**
   * funding_info findFirstOrThrow
   */
  export type funding_infoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter, which funding_info to fetch.
     */
    where?: funding_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_infos to fetch.
     */
    orderBy?: funding_infoOrderByWithRelationInput | funding_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for funding_infos.
     */
    cursor?: funding_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of funding_infos.
     */
    distinct?: Funding_infoScalarFieldEnum | Funding_infoScalarFieldEnum[]
  }


  /**
   * funding_info findMany
   */
  export type funding_infoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter, which funding_infos to fetch.
     */
    where?: funding_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_infos to fetch.
     */
    orderBy?: funding_infoOrderByWithRelationInput | funding_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing funding_infos.
     */
    cursor?: funding_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_infos.
     */
    skip?: number
    distinct?: Funding_infoScalarFieldEnum | Funding_infoScalarFieldEnum[]
  }


  /**
   * funding_info create
   */
  export type funding_infoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * The data needed to create a funding_info.
     */
    data: XOR<funding_infoCreateInput, funding_infoUncheckedCreateInput>
  }


  /**
   * funding_info createMany
   */
  export type funding_infoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many funding_infos.
     */
    data: funding_infoCreateManyInput | funding_infoCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * funding_info update
   */
  export type funding_infoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * The data needed to update a funding_info.
     */
    data: XOR<funding_infoUpdateInput, funding_infoUncheckedUpdateInput>
    /**
     * Choose, which funding_info to update.
     */
    where: funding_infoWhereUniqueInput
  }


  /**
   * funding_info updateMany
   */
  export type funding_infoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update funding_infos.
     */
    data: XOR<funding_infoUpdateManyMutationInput, funding_infoUncheckedUpdateManyInput>
    /**
     * Filter which funding_infos to update
     */
    where?: funding_infoWhereInput
  }


  /**
   * funding_info upsert
   */
  export type funding_infoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * The filter to search for the funding_info to update in case it exists.
     */
    where: funding_infoWhereUniqueInput
    /**
     * In case the funding_info found by the `where` argument doesn't exist, create a new funding_info with this data.
     */
    create: XOR<funding_infoCreateInput, funding_infoUncheckedCreateInput>
    /**
     * In case the funding_info was found with the provided `where` argument, update it with this data.
     */
    update: XOR<funding_infoUpdateInput, funding_infoUncheckedUpdateInput>
  }


  /**
   * funding_info delete
   */
  export type funding_infoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
    /**
     * Filter which funding_info to delete.
     */
    where: funding_infoWhereUniqueInput
  }


  /**
   * funding_info deleteMany
   */
  export type funding_infoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which funding_infos to delete
     */
    where?: funding_infoWhereInput
  }


  /**
   * funding_info.categories
   */
  export type funding_info$categoriesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    where?: categoriesWhereInput
    orderBy?: categoriesOrderByWithRelationInput | categoriesOrderByWithRelationInput[]
    cursor?: categoriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }


  /**
   * funding_info.press_references
   */
  export type funding_info$press_referencesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    where?: press_referencesWhereInput
    orderBy?: press_referencesOrderByWithRelationInput | press_referencesOrderByWithRelationInput[]
    cursor?: press_referencesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Press_referencesScalarFieldEnum | Press_referencesScalarFieldEnum[]
  }


  /**
   * funding_info.raised_funding_rounds
   */
  export type funding_info$raised_funding_roundsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    where?: funding_roundsWhereInput
    orderBy?: funding_roundsOrderByWithRelationInput | funding_roundsOrderByWithRelationInput[]
    cursor?: funding_roundsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Funding_roundsScalarFieldEnum | Funding_roundsScalarFieldEnum[]
  }


  /**
   * funding_info.founders
   */
  export type funding_info$foundersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    where?: foundersWhereInput
    orderBy?: foundersOrderByWithRelationInput | foundersOrderByWithRelationInput[]
    cursor?: foundersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FoundersScalarFieldEnum | FoundersScalarFieldEnum[]
  }


  /**
   * funding_info without action
   */
  export type funding_infoDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_info
     */
    select?: funding_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_infoInclude<ExtArgs> | null
  }



  /**
   * Model categories
   */

  export type AggregateCategories = {
    _count: CategoriesCountAggregateOutputType | null
    _min: CategoriesMinAggregateOutputType | null
    _max: CategoriesMaxAggregateOutputType | null
  }

  export type CategoriesMinAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    category: string | null
  }

  export type CategoriesMaxAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    category: string | null
  }

  export type CategoriesCountAggregateOutputType = {
    id: number
    funding_info_id: number
    category: number
    _all: number
  }


  export type CategoriesMinAggregateInputType = {
    id?: true
    funding_info_id?: true
    category?: true
  }

  export type CategoriesMaxAggregateInputType = {
    id?: true
    funding_info_id?: true
    category?: true
  }

  export type CategoriesCountAggregateInputType = {
    id?: true
    funding_info_id?: true
    category?: true
    _all?: true
  }

  export type CategoriesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which categories to aggregate.
     */
    where?: categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoriesOrderByWithRelationInput | categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned categories
    **/
    _count?: true | CategoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoriesMaxAggregateInputType
  }

  export type GetCategoriesAggregateType<T extends CategoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateCategories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategories[P]>
      : GetScalarType<T[P], AggregateCategories[P]>
  }




  export type categoriesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: categoriesWhereInput
    orderBy?: categoriesOrderByWithAggregationInput | categoriesOrderByWithAggregationInput[]
    by: CategoriesScalarFieldEnum[] | CategoriesScalarFieldEnum
    having?: categoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoriesCountAggregateInputType | true
    _min?: CategoriesMinAggregateInputType
    _max?: CategoriesMaxAggregateInputType
  }

  export type CategoriesGroupByOutputType = {
    id: string
    funding_info_id: string
    category: string
    _count: CategoriesCountAggregateOutputType | null
    _min: CategoriesMinAggregateOutputType | null
    _max: CategoriesMaxAggregateOutputType | null
  }

  type GetCategoriesGroupByPayload<T extends categoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriesGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriesGroupByOutputType[P]>
        }
      >
    >


  export type categoriesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funding_info_id?: boolean
    category?: boolean
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categories"]>

  export type categoriesSelectScalar = {
    id?: boolean
    funding_info_id?: boolean
    category?: boolean
  }

  export type categoriesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }


  export type $categoriesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "categories"
    objects: {
      funding_info: Prisma.$funding_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      funding_info_id: string
      category: string
    }, ExtArgs["result"]["categories"]>
    composites: {}
  }


  type categoriesGetPayload<S extends boolean | null | undefined | categoriesDefaultArgs> = $Result.GetResult<Prisma.$categoriesPayload, S>

  type categoriesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<categoriesFindManyArgs, 'select' | 'include'> & {
      select?: CategoriesCountAggregateInputType | true
    }

  export interface categoriesDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['categories'], meta: { name: 'categories' } }
    /**
     * Find zero or one Categories that matches the filter.
     * @param {categoriesFindUniqueArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends categoriesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesFindUniqueArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Categories that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {categoriesFindUniqueOrThrowArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends categoriesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesFindFirstArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends categoriesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesFindFirstArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Categories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesFindFirstOrThrowArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends categoriesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.categories.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.categories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoriesWithIdOnly = await prisma.categories.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends categoriesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Categories.
     * @param {categoriesCreateArgs} args - Arguments to create a Categories.
     * @example
     * // Create one Categories
     * const Categories = await prisma.categories.create({
     *   data: {
     *     // ... data to create a Categories
     *   }
     * })
     * 
    **/
    create<T extends categoriesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesCreateArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Categories.
     *     @param {categoriesCreateManyArgs} args - Arguments to create many Categories.
     *     @example
     *     // Create many Categories
     *     const categories = await prisma.categories.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends categoriesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Categories.
     * @param {categoriesDeleteArgs} args - Arguments to delete one Categories.
     * @example
     * // Delete one Categories
     * const Categories = await prisma.categories.delete({
     *   where: {
     *     // ... filter to delete one Categories
     *   }
     * })
     * 
    **/
    delete<T extends categoriesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesDeleteArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Categories.
     * @param {categoriesUpdateArgs} args - Arguments to update one Categories.
     * @example
     * // Update one Categories
     * const categories = await prisma.categories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends categoriesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesUpdateArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Categories.
     * @param {categoriesDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.categories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends categoriesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, categoriesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const categories = await prisma.categories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends categoriesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Categories.
     * @param {categoriesUpsertArgs} args - Arguments to update or create a Categories.
     * @example
     * // Update or create a Categories
     * const categories = await prisma.categories.upsert({
     *   create: {
     *     // ... data to create a Categories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categories we want to update
     *   }
     * })
    **/
    upsert<T extends categoriesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, categoriesUpsertArgs<ExtArgs>>
    ): Prisma__categoriesClient<$Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.categories.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends categoriesCountArgs>(
      args?: Subset<T, categoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoriesAggregateArgs>(args: Subset<T, CategoriesAggregateArgs>): Prisma.PrismaPromise<GetCategoriesAggregateType<T>>

    /**
     * Group by Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends categoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: categoriesGroupByArgs['orderBy'] }
        : { orderBy?: categoriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, categoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the categories model
   */
  readonly fields: categoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for categories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__categoriesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    funding_info<T extends funding_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, funding_infoDefaultArgs<ExtArgs>>): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the categories model
   */ 
  interface categoriesFieldRefs {
    readonly id: FieldRef<"categories", 'String'>
    readonly funding_info_id: FieldRef<"categories", 'String'>
    readonly category: FieldRef<"categories", 'String'>
  }
    

  // Custom InputTypes

  /**
   * categories findUnique
   */
  export type categoriesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where: categoriesWhereUniqueInput
  }


  /**
   * categories findUniqueOrThrow
   */
  export type categoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where: categoriesWhereUniqueInput
  }


  /**
   * categories findFirst
   */
  export type categoriesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoriesOrderByWithRelationInput | categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }


  /**
   * categories findFirstOrThrow
   */
  export type categoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoriesOrderByWithRelationInput | categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }


  /**
   * categories findMany
   */
  export type categoriesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoriesOrderByWithRelationInput | categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing categories.
     */
    cursor?: categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }


  /**
   * categories create
   */
  export type categoriesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a categories.
     */
    data: XOR<categoriesCreateInput, categoriesUncheckedCreateInput>
  }


  /**
   * categories createMany
   */
  export type categoriesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many categories.
     */
    data: categoriesCreateManyInput | categoriesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * categories update
   */
  export type categoriesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a categories.
     */
    data: XOR<categoriesUpdateInput, categoriesUncheckedUpdateInput>
    /**
     * Choose, which categories to update.
     */
    where: categoriesWhereUniqueInput
  }


  /**
   * categories updateMany
   */
  export type categoriesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update categories.
     */
    data: XOR<categoriesUpdateManyMutationInput, categoriesUncheckedUpdateManyInput>
    /**
     * Filter which categories to update
     */
    where?: categoriesWhereInput
  }


  /**
   * categories upsert
   */
  export type categoriesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the categories to update in case it exists.
     */
    where: categoriesWhereUniqueInput
    /**
     * In case the categories found by the `where` argument doesn't exist, create a new categories with this data.
     */
    create: XOR<categoriesCreateInput, categoriesUncheckedCreateInput>
    /**
     * In case the categories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<categoriesUpdateInput, categoriesUncheckedUpdateInput>
  }


  /**
   * categories delete
   */
  export type categoriesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
    /**
     * Filter which categories to delete.
     */
    where: categoriesWhereUniqueInput
  }


  /**
   * categories deleteMany
   */
  export type categoriesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which categories to delete
     */
    where?: categoriesWhereInput
  }


  /**
   * categories without action
   */
  export type categoriesDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: categoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: categoriesInclude<ExtArgs> | null
  }



  /**
   * Model press_references
   */

  export type AggregatePress_references = {
    _count: Press_referencesCountAggregateOutputType | null
    _min: Press_referencesMinAggregateOutputType | null
    _max: Press_referencesMaxAggregateOutputType | null
  }

  export type Press_referencesMinAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    author: string | null
    title: string | null
    publisher: string | null
    url: string | null
    posted_on: Date | null
  }

  export type Press_referencesMaxAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    author: string | null
    title: string | null
    publisher: string | null
    url: string | null
    posted_on: Date | null
  }

  export type Press_referencesCountAggregateOutputType = {
    id: number
    funding_info_id: number
    author: number
    title: number
    publisher: number
    url: number
    posted_on: number
    _all: number
  }


  export type Press_referencesMinAggregateInputType = {
    id?: true
    funding_info_id?: true
    author?: true
    title?: true
    publisher?: true
    url?: true
    posted_on?: true
  }

  export type Press_referencesMaxAggregateInputType = {
    id?: true
    funding_info_id?: true
    author?: true
    title?: true
    publisher?: true
    url?: true
    posted_on?: true
  }

  export type Press_referencesCountAggregateInputType = {
    id?: true
    funding_info_id?: true
    author?: true
    title?: true
    publisher?: true
    url?: true
    posted_on?: true
    _all?: true
  }

  export type Press_referencesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which press_references to aggregate.
     */
    where?: press_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of press_references to fetch.
     */
    orderBy?: press_referencesOrderByWithRelationInput | press_referencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: press_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` press_references from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` press_references.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned press_references
    **/
    _count?: true | Press_referencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Press_referencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Press_referencesMaxAggregateInputType
  }

  export type GetPress_referencesAggregateType<T extends Press_referencesAggregateArgs> = {
        [P in keyof T & keyof AggregatePress_references]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePress_references[P]>
      : GetScalarType<T[P], AggregatePress_references[P]>
  }




  export type press_referencesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: press_referencesWhereInput
    orderBy?: press_referencesOrderByWithAggregationInput | press_referencesOrderByWithAggregationInput[]
    by: Press_referencesScalarFieldEnum[] | Press_referencesScalarFieldEnum
    having?: press_referencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Press_referencesCountAggregateInputType | true
    _min?: Press_referencesMinAggregateInputType
    _max?: Press_referencesMaxAggregateInputType
  }

  export type Press_referencesGroupByOutputType = {
    id: string
    funding_info_id: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date
    _count: Press_referencesCountAggregateOutputType | null
    _min: Press_referencesMinAggregateOutputType | null
    _max: Press_referencesMaxAggregateOutputType | null
  }

  type GetPress_referencesGroupByPayload<T extends press_referencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Press_referencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Press_referencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Press_referencesGroupByOutputType[P]>
            : GetScalarType<T[P], Press_referencesGroupByOutputType[P]>
        }
      >
    >


  export type press_referencesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funding_info_id?: boolean
    author?: boolean
    title?: boolean
    publisher?: boolean
    url?: boolean
    posted_on?: boolean
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["press_references"]>

  export type press_referencesSelectScalar = {
    id?: boolean
    funding_info_id?: boolean
    author?: boolean
    title?: boolean
    publisher?: boolean
    url?: boolean
    posted_on?: boolean
  }

  export type press_referencesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }


  export type $press_referencesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "press_references"
    objects: {
      funding_info: Prisma.$funding_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      funding_info_id: string
      author: string
      title: string
      publisher: string
      url: string
      posted_on: Date
    }, ExtArgs["result"]["press_references"]>
    composites: {}
  }


  type press_referencesGetPayload<S extends boolean | null | undefined | press_referencesDefaultArgs> = $Result.GetResult<Prisma.$press_referencesPayload, S>

  type press_referencesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<press_referencesFindManyArgs, 'select' | 'include'> & {
      select?: Press_referencesCountAggregateInputType | true
    }

  export interface press_referencesDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['press_references'], meta: { name: 'press_references' } }
    /**
     * Find zero or one Press_references that matches the filter.
     * @param {press_referencesFindUniqueArgs} args - Arguments to find a Press_references
     * @example
     * // Get one Press_references
     * const press_references = await prisma.press_references.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends press_referencesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesFindUniqueArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Press_references that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {press_referencesFindUniqueOrThrowArgs} args - Arguments to find a Press_references
     * @example
     * // Get one Press_references
     * const press_references = await prisma.press_references.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends press_referencesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Press_references that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesFindFirstArgs} args - Arguments to find a Press_references
     * @example
     * // Get one Press_references
     * const press_references = await prisma.press_references.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends press_referencesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesFindFirstArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Press_references that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesFindFirstOrThrowArgs} args - Arguments to find a Press_references
     * @example
     * // Get one Press_references
     * const press_references = await prisma.press_references.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends press_referencesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Press_references that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Press_references
     * const press_references = await prisma.press_references.findMany()
     * 
     * // Get first 10 Press_references
     * const press_references = await prisma.press_references.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const press_referencesWithIdOnly = await prisma.press_references.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends press_referencesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Press_references.
     * @param {press_referencesCreateArgs} args - Arguments to create a Press_references.
     * @example
     * // Create one Press_references
     * const Press_references = await prisma.press_references.create({
     *   data: {
     *     // ... data to create a Press_references
     *   }
     * })
     * 
    **/
    create<T extends press_referencesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesCreateArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Press_references.
     *     @param {press_referencesCreateManyArgs} args - Arguments to create many Press_references.
     *     @example
     *     // Create many Press_references
     *     const press_references = await prisma.press_references.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends press_referencesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Press_references.
     * @param {press_referencesDeleteArgs} args - Arguments to delete one Press_references.
     * @example
     * // Delete one Press_references
     * const Press_references = await prisma.press_references.delete({
     *   where: {
     *     // ... filter to delete one Press_references
     *   }
     * })
     * 
    **/
    delete<T extends press_referencesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesDeleteArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Press_references.
     * @param {press_referencesUpdateArgs} args - Arguments to update one Press_references.
     * @example
     * // Update one Press_references
     * const press_references = await prisma.press_references.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends press_referencesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesUpdateArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Press_references.
     * @param {press_referencesDeleteManyArgs} args - Arguments to filter Press_references to delete.
     * @example
     * // Delete a few Press_references
     * const { count } = await prisma.press_references.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends press_referencesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, press_referencesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Press_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Press_references
     * const press_references = await prisma.press_references.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends press_referencesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Press_references.
     * @param {press_referencesUpsertArgs} args - Arguments to update or create a Press_references.
     * @example
     * // Update or create a Press_references
     * const press_references = await prisma.press_references.upsert({
     *   create: {
     *     // ... data to create a Press_references
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Press_references we want to update
     *   }
     * })
    **/
    upsert<T extends press_referencesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, press_referencesUpsertArgs<ExtArgs>>
    ): Prisma__press_referencesClient<$Result.GetResult<Prisma.$press_referencesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Press_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesCountArgs} args - Arguments to filter Press_references to count.
     * @example
     * // Count the number of Press_references
     * const count = await prisma.press_references.count({
     *   where: {
     *     // ... the filter for the Press_references we want to count
     *   }
     * })
    **/
    count<T extends press_referencesCountArgs>(
      args?: Subset<T, press_referencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Press_referencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Press_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Press_referencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Press_referencesAggregateArgs>(args: Subset<T, Press_referencesAggregateArgs>): Prisma.PrismaPromise<GetPress_referencesAggregateType<T>>

    /**
     * Group by Press_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {press_referencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends press_referencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: press_referencesGroupByArgs['orderBy'] }
        : { orderBy?: press_referencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, press_referencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPress_referencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the press_references model
   */
  readonly fields: press_referencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for press_references.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__press_referencesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    funding_info<T extends funding_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, funding_infoDefaultArgs<ExtArgs>>): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the press_references model
   */ 
  interface press_referencesFieldRefs {
    readonly id: FieldRef<"press_references", 'String'>
    readonly funding_info_id: FieldRef<"press_references", 'String'>
    readonly author: FieldRef<"press_references", 'String'>
    readonly title: FieldRef<"press_references", 'String'>
    readonly publisher: FieldRef<"press_references", 'String'>
    readonly url: FieldRef<"press_references", 'String'>
    readonly posted_on: FieldRef<"press_references", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * press_references findUnique
   */
  export type press_referencesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter, which press_references to fetch.
     */
    where: press_referencesWhereUniqueInput
  }


  /**
   * press_references findUniqueOrThrow
   */
  export type press_referencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter, which press_references to fetch.
     */
    where: press_referencesWhereUniqueInput
  }


  /**
   * press_references findFirst
   */
  export type press_referencesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter, which press_references to fetch.
     */
    where?: press_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of press_references to fetch.
     */
    orderBy?: press_referencesOrderByWithRelationInput | press_referencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for press_references.
     */
    cursor?: press_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` press_references from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` press_references.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of press_references.
     */
    distinct?: Press_referencesScalarFieldEnum | Press_referencesScalarFieldEnum[]
  }


  /**
   * press_references findFirstOrThrow
   */
  export type press_referencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter, which press_references to fetch.
     */
    where?: press_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of press_references to fetch.
     */
    orderBy?: press_referencesOrderByWithRelationInput | press_referencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for press_references.
     */
    cursor?: press_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` press_references from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` press_references.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of press_references.
     */
    distinct?: Press_referencesScalarFieldEnum | Press_referencesScalarFieldEnum[]
  }


  /**
   * press_references findMany
   */
  export type press_referencesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter, which press_references to fetch.
     */
    where?: press_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of press_references to fetch.
     */
    orderBy?: press_referencesOrderByWithRelationInput | press_referencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing press_references.
     */
    cursor?: press_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` press_references from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` press_references.
     */
    skip?: number
    distinct?: Press_referencesScalarFieldEnum | Press_referencesScalarFieldEnum[]
  }


  /**
   * press_references create
   */
  export type press_referencesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * The data needed to create a press_references.
     */
    data: XOR<press_referencesCreateInput, press_referencesUncheckedCreateInput>
  }


  /**
   * press_references createMany
   */
  export type press_referencesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many press_references.
     */
    data: press_referencesCreateManyInput | press_referencesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * press_references update
   */
  export type press_referencesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * The data needed to update a press_references.
     */
    data: XOR<press_referencesUpdateInput, press_referencesUncheckedUpdateInput>
    /**
     * Choose, which press_references to update.
     */
    where: press_referencesWhereUniqueInput
  }


  /**
   * press_references updateMany
   */
  export type press_referencesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update press_references.
     */
    data: XOR<press_referencesUpdateManyMutationInput, press_referencesUncheckedUpdateManyInput>
    /**
     * Filter which press_references to update
     */
    where?: press_referencesWhereInput
  }


  /**
   * press_references upsert
   */
  export type press_referencesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * The filter to search for the press_references to update in case it exists.
     */
    where: press_referencesWhereUniqueInput
    /**
     * In case the press_references found by the `where` argument doesn't exist, create a new press_references with this data.
     */
    create: XOR<press_referencesCreateInput, press_referencesUncheckedCreateInput>
    /**
     * In case the press_references was found with the provided `where` argument, update it with this data.
     */
    update: XOR<press_referencesUpdateInput, press_referencesUncheckedUpdateInput>
  }


  /**
   * press_references delete
   */
  export type press_referencesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
    /**
     * Filter which press_references to delete.
     */
    where: press_referencesWhereUniqueInput
  }


  /**
   * press_references deleteMany
   */
  export type press_referencesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which press_references to delete
     */
    where?: press_referencesWhereInput
  }


  /**
   * press_references without action
   */
  export type press_referencesDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the press_references
     */
    select?: press_referencesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: press_referencesInclude<ExtArgs> | null
  }



  /**
   * Model funding_rounds
   */

  export type AggregateFunding_rounds = {
    _count: Funding_roundsCountAggregateOutputType | null
    _avg: Funding_roundsAvgAggregateOutputType | null
    _sum: Funding_roundsSumAggregateOutputType | null
    _min: Funding_roundsMinAggregateOutputType | null
    _max: Funding_roundsMaxAggregateOutputType | null
  }

  export type Funding_roundsAvgAggregateOutputType = {
    money_raised: number | null
  }

  export type Funding_roundsSumAggregateOutputType = {
    money_raised: number | null
  }

  export type Funding_roundsMinAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    is_equity: boolean | null
    investment_stage: string | null
    short_description: string | null
    currency: string | null
    money_raised: number | null
    announced_on: Date | null
  }

  export type Funding_roundsMaxAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    is_equity: boolean | null
    investment_stage: string | null
    short_description: string | null
    currency: string | null
    money_raised: number | null
    announced_on: Date | null
  }

  export type Funding_roundsCountAggregateOutputType = {
    id: number
    funding_info_id: number
    is_equity: number
    investment_stage: number
    short_description: number
    currency: number
    money_raised: number
    announced_on: number
    _all: number
  }


  export type Funding_roundsAvgAggregateInputType = {
    money_raised?: true
  }

  export type Funding_roundsSumAggregateInputType = {
    money_raised?: true
  }

  export type Funding_roundsMinAggregateInputType = {
    id?: true
    funding_info_id?: true
    is_equity?: true
    investment_stage?: true
    short_description?: true
    currency?: true
    money_raised?: true
    announced_on?: true
  }

  export type Funding_roundsMaxAggregateInputType = {
    id?: true
    funding_info_id?: true
    is_equity?: true
    investment_stage?: true
    short_description?: true
    currency?: true
    money_raised?: true
    announced_on?: true
  }

  export type Funding_roundsCountAggregateInputType = {
    id?: true
    funding_info_id?: true
    is_equity?: true
    investment_stage?: true
    short_description?: true
    currency?: true
    money_raised?: true
    announced_on?: true
    _all?: true
  }

  export type Funding_roundsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which funding_rounds to aggregate.
     */
    where?: funding_roundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_rounds to fetch.
     */
    orderBy?: funding_roundsOrderByWithRelationInput | funding_roundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: funding_roundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_rounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_rounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned funding_rounds
    **/
    _count?: true | Funding_roundsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Funding_roundsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Funding_roundsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Funding_roundsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Funding_roundsMaxAggregateInputType
  }

  export type GetFunding_roundsAggregateType<T extends Funding_roundsAggregateArgs> = {
        [P in keyof T & keyof AggregateFunding_rounds]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFunding_rounds[P]>
      : GetScalarType<T[P], AggregateFunding_rounds[P]>
  }




  export type funding_roundsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: funding_roundsWhereInput
    orderBy?: funding_roundsOrderByWithAggregationInput | funding_roundsOrderByWithAggregationInput[]
    by: Funding_roundsScalarFieldEnum[] | Funding_roundsScalarFieldEnum
    having?: funding_roundsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Funding_roundsCountAggregateInputType | true
    _avg?: Funding_roundsAvgAggregateInputType
    _sum?: Funding_roundsSumAggregateInputType
    _min?: Funding_roundsMinAggregateInputType
    _max?: Funding_roundsMaxAggregateInputType
  }

  export type Funding_roundsGroupByOutputType = {
    id: string
    funding_info_id: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date
    _count: Funding_roundsCountAggregateOutputType | null
    _avg: Funding_roundsAvgAggregateOutputType | null
    _sum: Funding_roundsSumAggregateOutputType | null
    _min: Funding_roundsMinAggregateOutputType | null
    _max: Funding_roundsMaxAggregateOutputType | null
  }

  type GetFunding_roundsGroupByPayload<T extends funding_roundsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Funding_roundsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Funding_roundsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Funding_roundsGroupByOutputType[P]>
            : GetScalarType<T[P], Funding_roundsGroupByOutputType[P]>
        }
      >
    >


  export type funding_roundsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funding_info_id?: boolean
    is_equity?: boolean
    investment_stage?: boolean
    short_description?: boolean
    currency?: boolean
    money_raised?: boolean
    announced_on?: boolean
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funding_rounds"]>

  export type funding_roundsSelectScalar = {
    id?: boolean
    funding_info_id?: boolean
    is_equity?: boolean
    investment_stage?: boolean
    short_description?: boolean
    currency?: boolean
    money_raised?: boolean
    announced_on?: boolean
  }

  export type funding_roundsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }


  export type $funding_roundsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "funding_rounds"
    objects: {
      funding_info: Prisma.$funding_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      funding_info_id: string
      is_equity: boolean
      investment_stage: string
      short_description: string
      currency: string
      money_raised: number
      announced_on: Date
    }, ExtArgs["result"]["funding_rounds"]>
    composites: {}
  }


  type funding_roundsGetPayload<S extends boolean | null | undefined | funding_roundsDefaultArgs> = $Result.GetResult<Prisma.$funding_roundsPayload, S>

  type funding_roundsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<funding_roundsFindManyArgs, 'select' | 'include'> & {
      select?: Funding_roundsCountAggregateInputType | true
    }

  export interface funding_roundsDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['funding_rounds'], meta: { name: 'funding_rounds' } }
    /**
     * Find zero or one Funding_rounds that matches the filter.
     * @param {funding_roundsFindUniqueArgs} args - Arguments to find a Funding_rounds
     * @example
     * // Get one Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends funding_roundsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsFindUniqueArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Funding_rounds that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {funding_roundsFindUniqueOrThrowArgs} args - Arguments to find a Funding_rounds
     * @example
     * // Get one Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends funding_roundsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Funding_rounds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsFindFirstArgs} args - Arguments to find a Funding_rounds
     * @example
     * // Get one Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends funding_roundsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsFindFirstArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Funding_rounds that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsFindFirstOrThrowArgs} args - Arguments to find a Funding_rounds
     * @example
     * // Get one Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends funding_roundsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Funding_rounds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findMany()
     * 
     * // Get first 10 Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const funding_roundsWithIdOnly = await prisma.funding_rounds.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends funding_roundsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Funding_rounds.
     * @param {funding_roundsCreateArgs} args - Arguments to create a Funding_rounds.
     * @example
     * // Create one Funding_rounds
     * const Funding_rounds = await prisma.funding_rounds.create({
     *   data: {
     *     // ... data to create a Funding_rounds
     *   }
     * })
     * 
    **/
    create<T extends funding_roundsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsCreateArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Funding_rounds.
     *     @param {funding_roundsCreateManyArgs} args - Arguments to create many Funding_rounds.
     *     @example
     *     // Create many Funding_rounds
     *     const funding_rounds = await prisma.funding_rounds.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends funding_roundsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Funding_rounds.
     * @param {funding_roundsDeleteArgs} args - Arguments to delete one Funding_rounds.
     * @example
     * // Delete one Funding_rounds
     * const Funding_rounds = await prisma.funding_rounds.delete({
     *   where: {
     *     // ... filter to delete one Funding_rounds
     *   }
     * })
     * 
    **/
    delete<T extends funding_roundsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsDeleteArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Funding_rounds.
     * @param {funding_roundsUpdateArgs} args - Arguments to update one Funding_rounds.
     * @example
     * // Update one Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends funding_roundsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsUpdateArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Funding_rounds.
     * @param {funding_roundsDeleteManyArgs} args - Arguments to filter Funding_rounds to delete.
     * @example
     * // Delete a few Funding_rounds
     * const { count } = await prisma.funding_rounds.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends funding_roundsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, funding_roundsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Funding_rounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends funding_roundsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Funding_rounds.
     * @param {funding_roundsUpsertArgs} args - Arguments to update or create a Funding_rounds.
     * @example
     * // Update or create a Funding_rounds
     * const funding_rounds = await prisma.funding_rounds.upsert({
     *   create: {
     *     // ... data to create a Funding_rounds
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Funding_rounds we want to update
     *   }
     * })
    **/
    upsert<T extends funding_roundsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, funding_roundsUpsertArgs<ExtArgs>>
    ): Prisma__funding_roundsClient<$Result.GetResult<Prisma.$funding_roundsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Funding_rounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsCountArgs} args - Arguments to filter Funding_rounds to count.
     * @example
     * // Count the number of Funding_rounds
     * const count = await prisma.funding_rounds.count({
     *   where: {
     *     // ... the filter for the Funding_rounds we want to count
     *   }
     * })
    **/
    count<T extends funding_roundsCountArgs>(
      args?: Subset<T, funding_roundsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Funding_roundsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Funding_rounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Funding_roundsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Funding_roundsAggregateArgs>(args: Subset<T, Funding_roundsAggregateArgs>): Prisma.PrismaPromise<GetFunding_roundsAggregateType<T>>

    /**
     * Group by Funding_rounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {funding_roundsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends funding_roundsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: funding_roundsGroupByArgs['orderBy'] }
        : { orderBy?: funding_roundsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, funding_roundsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFunding_roundsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the funding_rounds model
   */
  readonly fields: funding_roundsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for funding_rounds.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__funding_roundsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    funding_info<T extends funding_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, funding_infoDefaultArgs<ExtArgs>>): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the funding_rounds model
   */ 
  interface funding_roundsFieldRefs {
    readonly id: FieldRef<"funding_rounds", 'String'>
    readonly funding_info_id: FieldRef<"funding_rounds", 'String'>
    readonly is_equity: FieldRef<"funding_rounds", 'Boolean'>
    readonly investment_stage: FieldRef<"funding_rounds", 'String'>
    readonly short_description: FieldRef<"funding_rounds", 'String'>
    readonly currency: FieldRef<"funding_rounds", 'String'>
    readonly money_raised: FieldRef<"funding_rounds", 'Int'>
    readonly announced_on: FieldRef<"funding_rounds", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * funding_rounds findUnique
   */
  export type funding_roundsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter, which funding_rounds to fetch.
     */
    where: funding_roundsWhereUniqueInput
  }


  /**
   * funding_rounds findUniqueOrThrow
   */
  export type funding_roundsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter, which funding_rounds to fetch.
     */
    where: funding_roundsWhereUniqueInput
  }


  /**
   * funding_rounds findFirst
   */
  export type funding_roundsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter, which funding_rounds to fetch.
     */
    where?: funding_roundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_rounds to fetch.
     */
    orderBy?: funding_roundsOrderByWithRelationInput | funding_roundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for funding_rounds.
     */
    cursor?: funding_roundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_rounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_rounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of funding_rounds.
     */
    distinct?: Funding_roundsScalarFieldEnum | Funding_roundsScalarFieldEnum[]
  }


  /**
   * funding_rounds findFirstOrThrow
   */
  export type funding_roundsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter, which funding_rounds to fetch.
     */
    where?: funding_roundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_rounds to fetch.
     */
    orderBy?: funding_roundsOrderByWithRelationInput | funding_roundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for funding_rounds.
     */
    cursor?: funding_roundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_rounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_rounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of funding_rounds.
     */
    distinct?: Funding_roundsScalarFieldEnum | Funding_roundsScalarFieldEnum[]
  }


  /**
   * funding_rounds findMany
   */
  export type funding_roundsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter, which funding_rounds to fetch.
     */
    where?: funding_roundsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of funding_rounds to fetch.
     */
    orderBy?: funding_roundsOrderByWithRelationInput | funding_roundsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing funding_rounds.
     */
    cursor?: funding_roundsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` funding_rounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` funding_rounds.
     */
    skip?: number
    distinct?: Funding_roundsScalarFieldEnum | Funding_roundsScalarFieldEnum[]
  }


  /**
   * funding_rounds create
   */
  export type funding_roundsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * The data needed to create a funding_rounds.
     */
    data: XOR<funding_roundsCreateInput, funding_roundsUncheckedCreateInput>
  }


  /**
   * funding_rounds createMany
   */
  export type funding_roundsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many funding_rounds.
     */
    data: funding_roundsCreateManyInput | funding_roundsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * funding_rounds update
   */
  export type funding_roundsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * The data needed to update a funding_rounds.
     */
    data: XOR<funding_roundsUpdateInput, funding_roundsUncheckedUpdateInput>
    /**
     * Choose, which funding_rounds to update.
     */
    where: funding_roundsWhereUniqueInput
  }


  /**
   * funding_rounds updateMany
   */
  export type funding_roundsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update funding_rounds.
     */
    data: XOR<funding_roundsUpdateManyMutationInput, funding_roundsUncheckedUpdateManyInput>
    /**
     * Filter which funding_rounds to update
     */
    where?: funding_roundsWhereInput
  }


  /**
   * funding_rounds upsert
   */
  export type funding_roundsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * The filter to search for the funding_rounds to update in case it exists.
     */
    where: funding_roundsWhereUniqueInput
    /**
     * In case the funding_rounds found by the `where` argument doesn't exist, create a new funding_rounds with this data.
     */
    create: XOR<funding_roundsCreateInput, funding_roundsUncheckedCreateInput>
    /**
     * In case the funding_rounds was found with the provided `where` argument, update it with this data.
     */
    update: XOR<funding_roundsUpdateInput, funding_roundsUncheckedUpdateInput>
  }


  /**
   * funding_rounds delete
   */
  export type funding_roundsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
    /**
     * Filter which funding_rounds to delete.
     */
    where: funding_roundsWhereUniqueInput
  }


  /**
   * funding_rounds deleteMany
   */
  export type funding_roundsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which funding_rounds to delete
     */
    where?: funding_roundsWhereInput
  }


  /**
   * funding_rounds without action
   */
  export type funding_roundsDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the funding_rounds
     */
    select?: funding_roundsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: funding_roundsInclude<ExtArgs> | null
  }



  /**
   * Model founders
   */

  export type AggregateFounders = {
    _count: FoundersCountAggregateOutputType | null
    _avg: FoundersAvgAggregateOutputType | null
    _sum: FoundersSumAggregateOutputType | null
    _min: FoundersMinAggregateOutputType | null
    _max: FoundersMaxAggregateOutputType | null
  }

  export type FoundersAvgAggregateOutputType = {
    num_founded_organizations: number | null
    rank_person: number | null
  }

  export type FoundersSumAggregateOutputType = {
    num_founded_organizations: number | null
    rank_person: number | null
  }

  export type FoundersMinAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    full_name: string | null
    primary_job_title: string | null
    description: string | null
    linkedin: string | null
    num_founded_organizations: number | null
    rank_person: number | null
  }

  export type FoundersMaxAggregateOutputType = {
    id: string | null
    funding_info_id: string | null
    full_name: string | null
    primary_job_title: string | null
    description: string | null
    linkedin: string | null
    num_founded_organizations: number | null
    rank_person: number | null
  }

  export type FoundersCountAggregateOutputType = {
    id: number
    funding_info_id: number
    full_name: number
    primary_job_title: number
    description: number
    linkedin: number
    num_founded_organizations: number
    rank_person: number
    _all: number
  }


  export type FoundersAvgAggregateInputType = {
    num_founded_organizations?: true
    rank_person?: true
  }

  export type FoundersSumAggregateInputType = {
    num_founded_organizations?: true
    rank_person?: true
  }

  export type FoundersMinAggregateInputType = {
    id?: true
    funding_info_id?: true
    full_name?: true
    primary_job_title?: true
    description?: true
    linkedin?: true
    num_founded_organizations?: true
    rank_person?: true
  }

  export type FoundersMaxAggregateInputType = {
    id?: true
    funding_info_id?: true
    full_name?: true
    primary_job_title?: true
    description?: true
    linkedin?: true
    num_founded_organizations?: true
    rank_person?: true
  }

  export type FoundersCountAggregateInputType = {
    id?: true
    funding_info_id?: true
    full_name?: true
    primary_job_title?: true
    description?: true
    linkedin?: true
    num_founded_organizations?: true
    rank_person?: true
    _all?: true
  }

  export type FoundersAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which founders to aggregate.
     */
    where?: foundersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of founders to fetch.
     */
    orderBy?: foundersOrderByWithRelationInput | foundersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: foundersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` founders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` founders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned founders
    **/
    _count?: true | FoundersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FoundersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FoundersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FoundersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FoundersMaxAggregateInputType
  }

  export type GetFoundersAggregateType<T extends FoundersAggregateArgs> = {
        [P in keyof T & keyof AggregateFounders]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFounders[P]>
      : GetScalarType<T[P], AggregateFounders[P]>
  }




  export type foundersGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: foundersWhereInput
    orderBy?: foundersOrderByWithAggregationInput | foundersOrderByWithAggregationInput[]
    by: FoundersScalarFieldEnum[] | FoundersScalarFieldEnum
    having?: foundersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FoundersCountAggregateInputType | true
    _avg?: FoundersAvgAggregateInputType
    _sum?: FoundersSumAggregateInputType
    _min?: FoundersMinAggregateInputType
    _max?: FoundersMaxAggregateInputType
  }

  export type FoundersGroupByOutputType = {
    id: string
    funding_info_id: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
    _count: FoundersCountAggregateOutputType | null
    _avg: FoundersAvgAggregateOutputType | null
    _sum: FoundersSumAggregateOutputType | null
    _min: FoundersMinAggregateOutputType | null
    _max: FoundersMaxAggregateOutputType | null
  }

  type GetFoundersGroupByPayload<T extends foundersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FoundersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FoundersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FoundersGroupByOutputType[P]>
            : GetScalarType<T[P], FoundersGroupByOutputType[P]>
        }
      >
    >


  export type foundersSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funding_info_id?: boolean
    full_name?: boolean
    primary_job_title?: boolean
    description?: boolean
    linkedin?: boolean
    num_founded_organizations?: boolean
    rank_person?: boolean
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["founders"]>

  export type foundersSelectScalar = {
    id?: boolean
    funding_info_id?: boolean
    full_name?: boolean
    primary_job_title?: boolean
    description?: boolean
    linkedin?: boolean
    num_founded_organizations?: boolean
    rank_person?: boolean
  }

  export type foundersInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    funding_info?: boolean | funding_infoDefaultArgs<ExtArgs>
  }


  export type $foundersPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "founders"
    objects: {
      funding_info: Prisma.$funding_infoPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      funding_info_id: string
      full_name: string
      primary_job_title: string
      description: string
      linkedin: string
      num_founded_organizations: number
      rank_person: number
    }, ExtArgs["result"]["founders"]>
    composites: {}
  }


  type foundersGetPayload<S extends boolean | null | undefined | foundersDefaultArgs> = $Result.GetResult<Prisma.$foundersPayload, S>

  type foundersCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<foundersFindManyArgs, 'select' | 'include'> & {
      select?: FoundersCountAggregateInputType | true
    }

  export interface foundersDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['founders'], meta: { name: 'founders' } }
    /**
     * Find zero or one Founders that matches the filter.
     * @param {foundersFindUniqueArgs} args - Arguments to find a Founders
     * @example
     * // Get one Founders
     * const founders = await prisma.founders.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends foundersFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, foundersFindUniqueArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Founders that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {foundersFindUniqueOrThrowArgs} args - Arguments to find a Founders
     * @example
     * // Get one Founders
     * const founders = await prisma.founders.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends foundersFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Founders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersFindFirstArgs} args - Arguments to find a Founders
     * @example
     * // Get one Founders
     * const founders = await prisma.founders.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends foundersFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersFindFirstArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Founders that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersFindFirstOrThrowArgs} args - Arguments to find a Founders
     * @example
     * // Get one Founders
     * const founders = await prisma.founders.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends foundersFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Founders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Founders
     * const founders = await prisma.founders.findMany()
     * 
     * // Get first 10 Founders
     * const founders = await prisma.founders.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const foundersWithIdOnly = await prisma.founders.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends foundersFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Founders.
     * @param {foundersCreateArgs} args - Arguments to create a Founders.
     * @example
     * // Create one Founders
     * const Founders = await prisma.founders.create({
     *   data: {
     *     // ... data to create a Founders
     *   }
     * })
     * 
    **/
    create<T extends foundersCreateArgs<ExtArgs>>(
      args: SelectSubset<T, foundersCreateArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Founders.
     *     @param {foundersCreateManyArgs} args - Arguments to create many Founders.
     *     @example
     *     // Create many Founders
     *     const founders = await prisma.founders.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends foundersCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Founders.
     * @param {foundersDeleteArgs} args - Arguments to delete one Founders.
     * @example
     * // Delete one Founders
     * const Founders = await prisma.founders.delete({
     *   where: {
     *     // ... filter to delete one Founders
     *   }
     * })
     * 
    **/
    delete<T extends foundersDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, foundersDeleteArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Founders.
     * @param {foundersUpdateArgs} args - Arguments to update one Founders.
     * @example
     * // Update one Founders
     * const founders = await prisma.founders.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends foundersUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, foundersUpdateArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Founders.
     * @param {foundersDeleteManyArgs} args - Arguments to filter Founders to delete.
     * @example
     * // Delete a few Founders
     * const { count } = await prisma.founders.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends foundersDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, foundersDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Founders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Founders
     * const founders = await prisma.founders.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends foundersUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, foundersUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Founders.
     * @param {foundersUpsertArgs} args - Arguments to update or create a Founders.
     * @example
     * // Update or create a Founders
     * const founders = await prisma.founders.upsert({
     *   create: {
     *     // ... data to create a Founders
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Founders we want to update
     *   }
     * })
    **/
    upsert<T extends foundersUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, foundersUpsertArgs<ExtArgs>>
    ): Prisma__foundersClient<$Result.GetResult<Prisma.$foundersPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Founders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersCountArgs} args - Arguments to filter Founders to count.
     * @example
     * // Count the number of Founders
     * const count = await prisma.founders.count({
     *   where: {
     *     // ... the filter for the Founders we want to count
     *   }
     * })
    **/
    count<T extends foundersCountArgs>(
      args?: Subset<T, foundersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FoundersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Founders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FoundersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FoundersAggregateArgs>(args: Subset<T, FoundersAggregateArgs>): Prisma.PrismaPromise<GetFoundersAggregateType<T>>

    /**
     * Group by Founders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {foundersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends foundersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: foundersGroupByArgs['orderBy'] }
        : { orderBy?: foundersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, foundersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFoundersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the founders model
   */
  readonly fields: foundersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for founders.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__foundersClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    funding_info<T extends funding_infoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, funding_infoDefaultArgs<ExtArgs>>): Prisma__funding_infoClient<$Result.GetResult<Prisma.$funding_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the founders model
   */ 
  interface foundersFieldRefs {
    readonly id: FieldRef<"founders", 'String'>
    readonly funding_info_id: FieldRef<"founders", 'String'>
    readonly full_name: FieldRef<"founders", 'String'>
    readonly primary_job_title: FieldRef<"founders", 'String'>
    readonly description: FieldRef<"founders", 'String'>
    readonly linkedin: FieldRef<"founders", 'String'>
    readonly num_founded_organizations: FieldRef<"founders", 'Int'>
    readonly rank_person: FieldRef<"founders", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * founders findUnique
   */
  export type foundersFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter, which founders to fetch.
     */
    where: foundersWhereUniqueInput
  }


  /**
   * founders findUniqueOrThrow
   */
  export type foundersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter, which founders to fetch.
     */
    where: foundersWhereUniqueInput
  }


  /**
   * founders findFirst
   */
  export type foundersFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter, which founders to fetch.
     */
    where?: foundersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of founders to fetch.
     */
    orderBy?: foundersOrderByWithRelationInput | foundersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for founders.
     */
    cursor?: foundersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` founders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` founders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of founders.
     */
    distinct?: FoundersScalarFieldEnum | FoundersScalarFieldEnum[]
  }


  /**
   * founders findFirstOrThrow
   */
  export type foundersFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter, which founders to fetch.
     */
    where?: foundersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of founders to fetch.
     */
    orderBy?: foundersOrderByWithRelationInput | foundersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for founders.
     */
    cursor?: foundersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` founders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` founders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of founders.
     */
    distinct?: FoundersScalarFieldEnum | FoundersScalarFieldEnum[]
  }


  /**
   * founders findMany
   */
  export type foundersFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter, which founders to fetch.
     */
    where?: foundersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of founders to fetch.
     */
    orderBy?: foundersOrderByWithRelationInput | foundersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing founders.
     */
    cursor?: foundersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` founders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` founders.
     */
    skip?: number
    distinct?: FoundersScalarFieldEnum | FoundersScalarFieldEnum[]
  }


  /**
   * founders create
   */
  export type foundersCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * The data needed to create a founders.
     */
    data: XOR<foundersCreateInput, foundersUncheckedCreateInput>
  }


  /**
   * founders createMany
   */
  export type foundersCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many founders.
     */
    data: foundersCreateManyInput | foundersCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * founders update
   */
  export type foundersUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * The data needed to update a founders.
     */
    data: XOR<foundersUpdateInput, foundersUncheckedUpdateInput>
    /**
     * Choose, which founders to update.
     */
    where: foundersWhereUniqueInput
  }


  /**
   * founders updateMany
   */
  export type foundersUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update founders.
     */
    data: XOR<foundersUpdateManyMutationInput, foundersUncheckedUpdateManyInput>
    /**
     * Filter which founders to update
     */
    where?: foundersWhereInput
  }


  /**
   * founders upsert
   */
  export type foundersUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * The filter to search for the founders to update in case it exists.
     */
    where: foundersWhereUniqueInput
    /**
     * In case the founders found by the `where` argument doesn't exist, create a new founders with this data.
     */
    create: XOR<foundersCreateInput, foundersUncheckedCreateInput>
    /**
     * In case the founders was found with the provided `where` argument, update it with this data.
     */
    update: XOR<foundersUpdateInput, foundersUncheckedUpdateInput>
  }


  /**
   * founders delete
   */
  export type foundersDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
    /**
     * Filter which founders to delete.
     */
    where: foundersWhereUniqueInput
  }


  /**
   * founders deleteMany
   */
  export type foundersDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which founders to delete
     */
    where?: foundersWhereInput
  }


  /**
   * founders without action
   */
  export type foundersDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the founders
     */
    select?: foundersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: foundersInclude<ExtArgs> | null
  }



  /**
   * Model website_info
   */

  export type AggregateWebsite_info = {
    _count: Website_infoCountAggregateOutputType | null
    _min: Website_infoMinAggregateOutputType | null
    _max: Website_infoMaxAggregateOutputType | null
  }

  export type Website_infoMinAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
  }

  export type Website_infoMaxAggregateOutputType = {
    id: string | null
    company_id: string | null
    last_updated: Date | null
  }

  export type Website_infoCountAggregateOutputType = {
    id: number
    company_id: number
    last_updated: number
    _all: number
  }


  export type Website_infoMinAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
  }

  export type Website_infoMaxAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
  }

  export type Website_infoCountAggregateInputType = {
    id?: true
    company_id?: true
    last_updated?: true
    _all?: true
  }

  export type Website_infoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which website_info to aggregate.
     */
    where?: website_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of website_infos to fetch.
     */
    orderBy?: website_infoOrderByWithRelationInput | website_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: website_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` website_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` website_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned website_infos
    **/
    _count?: true | Website_infoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Website_infoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Website_infoMaxAggregateInputType
  }

  export type GetWebsite_infoAggregateType<T extends Website_infoAggregateArgs> = {
        [P in keyof T & keyof AggregateWebsite_info]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebsite_info[P]>
      : GetScalarType<T[P], AggregateWebsite_info[P]>
  }




  export type website_infoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: website_infoWhereInput
    orderBy?: website_infoOrderByWithAggregationInput | website_infoOrderByWithAggregationInput[]
    by: Website_infoScalarFieldEnum[] | Website_infoScalarFieldEnum
    having?: website_infoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Website_infoCountAggregateInputType | true
    _min?: Website_infoMinAggregateInputType
    _max?: Website_infoMaxAggregateInputType
  }

  export type Website_infoGroupByOutputType = {
    id: string
    company_id: string
    last_updated: Date
    _count: Website_infoCountAggregateOutputType | null
    _min: Website_infoMinAggregateOutputType | null
    _max: Website_infoMaxAggregateOutputType | null
  }

  type GetWebsite_infoGroupByPayload<T extends website_infoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Website_infoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Website_infoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Website_infoGroupByOutputType[P]>
            : GetScalarType<T[P], Website_infoGroupByOutputType[P]>
        }
      >
    >


  export type website_infoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["website_info"]>

  export type website_infoSelectScalar = {
    id?: boolean
    company_id?: boolean
    last_updated?: boolean
  }

  export type website_infoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    vendor_company?: boolean | vendor_companiesDefaultArgs<ExtArgs>
  }


  export type $website_infoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "website_info"
    objects: {
      vendor_company: Prisma.$vendor_companiesPayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      company_id: string
      last_updated: Date
    }, ExtArgs["result"]["website_info"]>
    composites: {}
  }


  type website_infoGetPayload<S extends boolean | null | undefined | website_infoDefaultArgs> = $Result.GetResult<Prisma.$website_infoPayload, S>

  type website_infoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<website_infoFindManyArgs, 'select' | 'include'> & {
      select?: Website_infoCountAggregateInputType | true
    }

  export interface website_infoDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['website_info'], meta: { name: 'website_info' } }
    /**
     * Find zero or one Website_info that matches the filter.
     * @param {website_infoFindUniqueArgs} args - Arguments to find a Website_info
     * @example
     * // Get one Website_info
     * const website_info = await prisma.website_info.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends website_infoFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoFindUniqueArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Website_info that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {website_infoFindUniqueOrThrowArgs} args - Arguments to find a Website_info
     * @example
     * // Get one Website_info
     * const website_info = await prisma.website_info.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends website_infoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Website_info that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoFindFirstArgs} args - Arguments to find a Website_info
     * @example
     * // Get one Website_info
     * const website_info = await prisma.website_info.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends website_infoFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoFindFirstArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Website_info that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoFindFirstOrThrowArgs} args - Arguments to find a Website_info
     * @example
     * // Get one Website_info
     * const website_info = await prisma.website_info.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends website_infoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Website_infos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Website_infos
     * const website_infos = await prisma.website_info.findMany()
     * 
     * // Get first 10 Website_infos
     * const website_infos = await prisma.website_info.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const website_infoWithIdOnly = await prisma.website_info.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends website_infoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Website_info.
     * @param {website_infoCreateArgs} args - Arguments to create a Website_info.
     * @example
     * // Create one Website_info
     * const Website_info = await prisma.website_info.create({
     *   data: {
     *     // ... data to create a Website_info
     *   }
     * })
     * 
    **/
    create<T extends website_infoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoCreateArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Website_infos.
     *     @param {website_infoCreateManyArgs} args - Arguments to create many Website_infos.
     *     @example
     *     // Create many Website_infos
     *     const website_info = await prisma.website_info.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends website_infoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Website_info.
     * @param {website_infoDeleteArgs} args - Arguments to delete one Website_info.
     * @example
     * // Delete one Website_info
     * const Website_info = await prisma.website_info.delete({
     *   where: {
     *     // ... filter to delete one Website_info
     *   }
     * })
     * 
    **/
    delete<T extends website_infoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoDeleteArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Website_info.
     * @param {website_infoUpdateArgs} args - Arguments to update one Website_info.
     * @example
     * // Update one Website_info
     * const website_info = await prisma.website_info.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends website_infoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoUpdateArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Website_infos.
     * @param {website_infoDeleteManyArgs} args - Arguments to filter Website_infos to delete.
     * @example
     * // Delete a few Website_infos
     * const { count } = await prisma.website_info.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends website_infoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, website_infoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Website_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Website_infos
     * const website_info = await prisma.website_info.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends website_infoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Website_info.
     * @param {website_infoUpsertArgs} args - Arguments to update or create a Website_info.
     * @example
     * // Update or create a Website_info
     * const website_info = await prisma.website_info.upsert({
     *   create: {
     *     // ... data to create a Website_info
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Website_info we want to update
     *   }
     * })
    **/
    upsert<T extends website_infoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, website_infoUpsertArgs<ExtArgs>>
    ): Prisma__website_infoClient<$Result.GetResult<Prisma.$website_infoPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Website_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoCountArgs} args - Arguments to filter Website_infos to count.
     * @example
     * // Count the number of Website_infos
     * const count = await prisma.website_info.count({
     *   where: {
     *     // ... the filter for the Website_infos we want to count
     *   }
     * })
    **/
    count<T extends website_infoCountArgs>(
      args?: Subset<T, website_infoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Website_infoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Website_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Website_infoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Website_infoAggregateArgs>(args: Subset<T, Website_infoAggregateArgs>): Prisma.PrismaPromise<GetWebsite_infoAggregateType<T>>

    /**
     * Group by Website_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {website_infoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends website_infoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: website_infoGroupByArgs['orderBy'] }
        : { orderBy?: website_infoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, website_infoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebsite_infoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the website_info model
   */
  readonly fields: website_infoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for website_info.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__website_infoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vendor_company<T extends vendor_companiesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, vendor_companiesDefaultArgs<ExtArgs>>): Prisma__vendor_companiesClient<$Result.GetResult<Prisma.$vendor_companiesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the website_info model
   */ 
  interface website_infoFieldRefs {
    readonly id: FieldRef<"website_info", 'String'>
    readonly company_id: FieldRef<"website_info", 'String'>
    readonly last_updated: FieldRef<"website_info", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * website_info findUnique
   */
  export type website_infoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter, which website_info to fetch.
     */
    where: website_infoWhereUniqueInput
  }


  /**
   * website_info findUniqueOrThrow
   */
  export type website_infoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter, which website_info to fetch.
     */
    where: website_infoWhereUniqueInput
  }


  /**
   * website_info findFirst
   */
  export type website_infoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter, which website_info to fetch.
     */
    where?: website_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of website_infos to fetch.
     */
    orderBy?: website_infoOrderByWithRelationInput | website_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for website_infos.
     */
    cursor?: website_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` website_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` website_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of website_infos.
     */
    distinct?: Website_infoScalarFieldEnum | Website_infoScalarFieldEnum[]
  }


  /**
   * website_info findFirstOrThrow
   */
  export type website_infoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter, which website_info to fetch.
     */
    where?: website_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of website_infos to fetch.
     */
    orderBy?: website_infoOrderByWithRelationInput | website_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for website_infos.
     */
    cursor?: website_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` website_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` website_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of website_infos.
     */
    distinct?: Website_infoScalarFieldEnum | Website_infoScalarFieldEnum[]
  }


  /**
   * website_info findMany
   */
  export type website_infoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter, which website_infos to fetch.
     */
    where?: website_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of website_infos to fetch.
     */
    orderBy?: website_infoOrderByWithRelationInput | website_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing website_infos.
     */
    cursor?: website_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` website_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` website_infos.
     */
    skip?: number
    distinct?: Website_infoScalarFieldEnum | Website_infoScalarFieldEnum[]
  }


  /**
   * website_info create
   */
  export type website_infoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * The data needed to create a website_info.
     */
    data: XOR<website_infoCreateInput, website_infoUncheckedCreateInput>
  }


  /**
   * website_info createMany
   */
  export type website_infoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many website_infos.
     */
    data: website_infoCreateManyInput | website_infoCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * website_info update
   */
  export type website_infoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * The data needed to update a website_info.
     */
    data: XOR<website_infoUpdateInput, website_infoUncheckedUpdateInput>
    /**
     * Choose, which website_info to update.
     */
    where: website_infoWhereUniqueInput
  }


  /**
   * website_info updateMany
   */
  export type website_infoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update website_infos.
     */
    data: XOR<website_infoUpdateManyMutationInput, website_infoUncheckedUpdateManyInput>
    /**
     * Filter which website_infos to update
     */
    where?: website_infoWhereInput
  }


  /**
   * website_info upsert
   */
  export type website_infoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * The filter to search for the website_info to update in case it exists.
     */
    where: website_infoWhereUniqueInput
    /**
     * In case the website_info found by the `where` argument doesn't exist, create a new website_info with this data.
     */
    create: XOR<website_infoCreateInput, website_infoUncheckedCreateInput>
    /**
     * In case the website_info was found with the provided `where` argument, update it with this data.
     */
    update: XOR<website_infoUpdateInput, website_infoUncheckedUpdateInput>
  }


  /**
   * website_info delete
   */
  export type website_infoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
    /**
     * Filter which website_info to delete.
     */
    where: website_infoWhereUniqueInput
  }


  /**
   * website_info deleteMany
   */
  export type website_infoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which website_infos to delete
     */
    where?: website_infoWhereInput
  }


  /**
   * website_info without action
   */
  export type website_infoDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the website_info
     */
    select?: website_infoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: website_infoInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Vendor_companiesScalarFieldEnum: {
    id: 'id',
    company_name: 'company_name',
    website_url: 'website_url',
    linkedin_url: 'linkedin_url',
    type: 'type',
    is_active: 'is_active',
    is_cromatic_vendor: 'is_cromatic_vendor'
  };

  export type Vendor_companiesScalarFieldEnum = (typeof Vendor_companiesScalarFieldEnum)[keyof typeof Vendor_companiesScalarFieldEnum]


  export const Traffic_infoScalarFieldEnum: {
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

  export type Traffic_infoScalarFieldEnum = (typeof Traffic_infoScalarFieldEnum)[keyof typeof Traffic_infoScalarFieldEnum]


  export const Linkedin_infoScalarFieldEnum: {
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

  export type Linkedin_infoScalarFieldEnum = (typeof Linkedin_infoScalarFieldEnum)[keyof typeof Linkedin_infoScalarFieldEnum]


  export const Company_specialtiesScalarFieldEnum: {
    id: 'id',
    linkedin_info_id: 'linkedin_info_id',
    specialty: 'specialty'
  };

  export type Company_specialtiesScalarFieldEnum = (typeof Company_specialtiesScalarFieldEnum)[keyof typeof Company_specialtiesScalarFieldEnum]


  export const Featured_employeesScalarFieldEnum: {
    id: 'id',
    linkedin_info_id: 'linkedin_info_id',
    linkedin_url: 'linkedin_url'
  };

  export type Featured_employeesScalarFieldEnum = (typeof Featured_employeesScalarFieldEnum)[keyof typeof Featured_employeesScalarFieldEnum]


  export const LocationsScalarFieldEnum: {
    id: 'id',
    linkedin_info_id: 'linkedin_info_id',
    location_address: 'location_address'
  };

  export type LocationsScalarFieldEnum = (typeof LocationsScalarFieldEnum)[keyof typeof LocationsScalarFieldEnum]


  export const Funding_infoScalarFieldEnum: {
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

  export type Funding_infoScalarFieldEnum = (typeof Funding_infoScalarFieldEnum)[keyof typeof Funding_infoScalarFieldEnum]


  export const CategoriesScalarFieldEnum: {
    id: 'id',
    funding_info_id: 'funding_info_id',
    category: 'category'
  };

  export type CategoriesScalarFieldEnum = (typeof CategoriesScalarFieldEnum)[keyof typeof CategoriesScalarFieldEnum]


  export const Press_referencesScalarFieldEnum: {
    id: 'id',
    funding_info_id: 'funding_info_id',
    author: 'author',
    title: 'title',
    publisher: 'publisher',
    url: 'url',
    posted_on: 'posted_on'
  };

  export type Press_referencesScalarFieldEnum = (typeof Press_referencesScalarFieldEnum)[keyof typeof Press_referencesScalarFieldEnum]


  export const Funding_roundsScalarFieldEnum: {
    id: 'id',
    funding_info_id: 'funding_info_id',
    is_equity: 'is_equity',
    investment_stage: 'investment_stage',
    short_description: 'short_description',
    currency: 'currency',
    money_raised: 'money_raised',
    announced_on: 'announced_on'
  };

  export type Funding_roundsScalarFieldEnum = (typeof Funding_roundsScalarFieldEnum)[keyof typeof Funding_roundsScalarFieldEnum]


  export const FoundersScalarFieldEnum: {
    id: 'id',
    funding_info_id: 'funding_info_id',
    full_name: 'full_name',
    primary_job_title: 'primary_job_title',
    description: 'description',
    linkedin: 'linkedin',
    num_founded_organizations: 'num_founded_organizations',
    rank_person: 'rank_person'
  };

  export type FoundersScalarFieldEnum = (typeof FoundersScalarFieldEnum)[keyof typeof FoundersScalarFieldEnum]


  export const Website_infoScalarFieldEnum: {
    id: 'id',
    company_id: 'company_id',
    last_updated: 'last_updated'
  };

  export type Website_infoScalarFieldEnum = (typeof Website_infoScalarFieldEnum)[keyof typeof Website_infoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type vendor_companiesWhereInput = {
    AND?: vendor_companiesWhereInput | vendor_companiesWhereInput[]
    OR?: vendor_companiesWhereInput[]
    NOT?: vendor_companiesWhereInput | vendor_companiesWhereInput[]
    id?: UuidFilter<"vendor_companies"> | string
    company_name?: StringFilter<"vendor_companies"> | string
    website_url?: StringFilter<"vendor_companies"> | string
    linkedin_url?: StringFilter<"vendor_companies"> | string
    type?: StringFilter<"vendor_companies"> | string
    is_active?: BoolFilter<"vendor_companies"> | boolean
    is_cromatic_vendor?: BoolFilter<"vendor_companies"> | boolean
    traffic_info?: Traffic_infoListRelationFilter
    linkedin_info?: Linkedin_infoListRelationFilter
    funding_info?: Funding_infoListRelationFilter
    website_info?: Website_infoListRelationFilter
  }

  export type vendor_companiesOrderByWithRelationInput = {
    id?: SortOrder
    company_name?: SortOrder
    website_url?: SortOrder
    linkedin_url?: SortOrder
    type?: SortOrder
    is_active?: SortOrder
    is_cromatic_vendor?: SortOrder
    traffic_info?: traffic_infoOrderByRelationAggregateInput
    linkedin_info?: linkedin_infoOrderByRelationAggregateInput
    funding_info?: funding_infoOrderByRelationAggregateInput
    website_info?: website_infoOrderByRelationAggregateInput
  }

  export type vendor_companiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: vendor_companiesWhereInput | vendor_companiesWhereInput[]
    OR?: vendor_companiesWhereInput[]
    NOT?: vendor_companiesWhereInput | vendor_companiesWhereInput[]
    company_name?: StringFilter<"vendor_companies"> | string
    website_url?: StringFilter<"vendor_companies"> | string
    linkedin_url?: StringFilter<"vendor_companies"> | string
    type?: StringFilter<"vendor_companies"> | string
    is_active?: BoolFilter<"vendor_companies"> | boolean
    is_cromatic_vendor?: BoolFilter<"vendor_companies"> | boolean
    traffic_info?: Traffic_infoListRelationFilter
    linkedin_info?: Linkedin_infoListRelationFilter
    funding_info?: Funding_infoListRelationFilter
    website_info?: Website_infoListRelationFilter
  }, "id">

  export type vendor_companiesOrderByWithAggregationInput = {
    id?: SortOrder
    company_name?: SortOrder
    website_url?: SortOrder
    linkedin_url?: SortOrder
    type?: SortOrder
    is_active?: SortOrder
    is_cromatic_vendor?: SortOrder
    _count?: vendor_companiesCountOrderByAggregateInput
    _max?: vendor_companiesMaxOrderByAggregateInput
    _min?: vendor_companiesMinOrderByAggregateInput
  }

  export type vendor_companiesScalarWhereWithAggregatesInput = {
    AND?: vendor_companiesScalarWhereWithAggregatesInput | vendor_companiesScalarWhereWithAggregatesInput[]
    OR?: vendor_companiesScalarWhereWithAggregatesInput[]
    NOT?: vendor_companiesScalarWhereWithAggregatesInput | vendor_companiesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"vendor_companies"> | string
    company_name?: StringWithAggregatesFilter<"vendor_companies"> | string
    website_url?: StringWithAggregatesFilter<"vendor_companies"> | string
    linkedin_url?: StringWithAggregatesFilter<"vendor_companies"> | string
    type?: StringWithAggregatesFilter<"vendor_companies"> | string
    is_active?: BoolWithAggregatesFilter<"vendor_companies"> | boolean
    is_cromatic_vendor?: BoolWithAggregatesFilter<"vendor_companies"> | boolean
  }

  export type traffic_infoWhereInput = {
    AND?: traffic_infoWhereInput | traffic_infoWhereInput[]
    OR?: traffic_infoWhereInput[]
    NOT?: traffic_infoWhereInput | traffic_infoWhereInput[]
    id?: UuidFilter<"traffic_info"> | string
    company_id?: UuidFilter<"traffic_info"> | string
    last_updated?: DateTimeFilter<"traffic_info"> | Date | string
    display_date?: DateTimeFilter<"traffic_info"> | Date | string
    rank?: IntFilter<"traffic_info"> | number
    visits?: IntFilter<"traffic_info"> | number
    users?: IntFilter<"traffic_info"> | number
    search_organic?: IntFilter<"traffic_info"> | number
    search_paid?: IntFilter<"traffic_info"> | number
    social_organic?: IntFilter<"traffic_info"> | number
    social_paid?: IntFilter<"traffic_info"> | number
    referral?: IntFilter<"traffic_info"> | number
    time_on_site?: IntFilter<"traffic_info"> | number
    pages_per_visit?: FloatFilter<"traffic_info"> | number
    bounce_rate?: FloatFilter<"traffic_info"> | number
    categories?: StringFilter<"traffic_info"> | string
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
  }

  export type traffic_infoOrderByWithRelationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    display_date?: SortOrder
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
    categories?: SortOrder
    vendor_company?: vendor_companiesOrderByWithRelationInput
  }

  export type traffic_infoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    company_id?: string
    AND?: traffic_infoWhereInput | traffic_infoWhereInput[]
    OR?: traffic_infoWhereInput[]
    NOT?: traffic_infoWhereInput | traffic_infoWhereInput[]
    last_updated?: DateTimeFilter<"traffic_info"> | Date | string
    display_date?: DateTimeFilter<"traffic_info"> | Date | string
    rank?: IntFilter<"traffic_info"> | number
    visits?: IntFilter<"traffic_info"> | number
    users?: IntFilter<"traffic_info"> | number
    search_organic?: IntFilter<"traffic_info"> | number
    search_paid?: IntFilter<"traffic_info"> | number
    social_organic?: IntFilter<"traffic_info"> | number
    social_paid?: IntFilter<"traffic_info"> | number
    referral?: IntFilter<"traffic_info"> | number
    time_on_site?: IntFilter<"traffic_info"> | number
    pages_per_visit?: FloatFilter<"traffic_info"> | number
    bounce_rate?: FloatFilter<"traffic_info"> | number
    categories?: StringFilter<"traffic_info"> | string
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
  }, "id" | "company_id">

  export type traffic_infoOrderByWithAggregationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    display_date?: SortOrder
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
    categories?: SortOrder
    _count?: traffic_infoCountOrderByAggregateInput
    _avg?: traffic_infoAvgOrderByAggregateInput
    _max?: traffic_infoMaxOrderByAggregateInput
    _min?: traffic_infoMinOrderByAggregateInput
    _sum?: traffic_infoSumOrderByAggregateInput
  }

  export type traffic_infoScalarWhereWithAggregatesInput = {
    AND?: traffic_infoScalarWhereWithAggregatesInput | traffic_infoScalarWhereWithAggregatesInput[]
    OR?: traffic_infoScalarWhereWithAggregatesInput[]
    NOT?: traffic_infoScalarWhereWithAggregatesInput | traffic_infoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"traffic_info"> | string
    company_id?: UuidWithAggregatesFilter<"traffic_info"> | string
    last_updated?: DateTimeWithAggregatesFilter<"traffic_info"> | Date | string
    display_date?: DateTimeWithAggregatesFilter<"traffic_info"> | Date | string
    rank?: IntWithAggregatesFilter<"traffic_info"> | number
    visits?: IntWithAggregatesFilter<"traffic_info"> | number
    users?: IntWithAggregatesFilter<"traffic_info"> | number
    search_organic?: IntWithAggregatesFilter<"traffic_info"> | number
    search_paid?: IntWithAggregatesFilter<"traffic_info"> | number
    social_organic?: IntWithAggregatesFilter<"traffic_info"> | number
    social_paid?: IntWithAggregatesFilter<"traffic_info"> | number
    referral?: IntWithAggregatesFilter<"traffic_info"> | number
    time_on_site?: IntWithAggregatesFilter<"traffic_info"> | number
    pages_per_visit?: FloatWithAggregatesFilter<"traffic_info"> | number
    bounce_rate?: FloatWithAggregatesFilter<"traffic_info"> | number
    categories?: StringWithAggregatesFilter<"traffic_info"> | string
  }

  export type linkedin_infoWhereInput = {
    AND?: linkedin_infoWhereInput | linkedin_infoWhereInput[]
    OR?: linkedin_infoWhereInput[]
    NOT?: linkedin_infoWhereInput | linkedin_infoWhereInput[]
    id?: StringFilter<"linkedin_info"> | string
    company_id?: UuidFilter<"linkedin_info"> | string
    last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    company_size?: StringFilter<"linkedin_info"> | string
    industry?: StringFilter<"linkedin_info"> | string
    description?: StringFilter<"linkedin_info"> | string
    linkedin_followers?: IntFilter<"linkedin_info"> | number
    founded?: IntFilter<"linkedin_info"> | number
    created?: DateTimeFilter<"linkedin_info"> | Date | string
    li_last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    type?: StringFilter<"linkedin_info"> | string
    employees_count?: IntFilter<"linkedin_info"> | number
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
    company_specialties_collection?: Company_specialtiesListRelationFilter
    company_featured_employees_collection?: Featured_employeesListRelationFilter
    locations_collection?: LocationsListRelationFilter
  }

  export type linkedin_infoOrderByWithRelationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_size?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    linkedin_followers?: SortOrder
    founded?: SortOrder
    created?: SortOrder
    li_last_updated?: SortOrder
    type?: SortOrder
    employees_count?: SortOrder
    vendor_company?: vendor_companiesOrderByWithRelationInput
    company_specialties_collection?: company_specialtiesOrderByRelationAggregateInput
    company_featured_employees_collection?: featured_employeesOrderByRelationAggregateInput
    locations_collection?: locationsOrderByRelationAggregateInput
  }

  export type linkedin_infoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    company_id?: string
    AND?: linkedin_infoWhereInput | linkedin_infoWhereInput[]
    OR?: linkedin_infoWhereInput[]
    NOT?: linkedin_infoWhereInput | linkedin_infoWhereInput[]
    last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    company_size?: StringFilter<"linkedin_info"> | string
    industry?: StringFilter<"linkedin_info"> | string
    description?: StringFilter<"linkedin_info"> | string
    linkedin_followers?: IntFilter<"linkedin_info"> | number
    founded?: IntFilter<"linkedin_info"> | number
    created?: DateTimeFilter<"linkedin_info"> | Date | string
    li_last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    type?: StringFilter<"linkedin_info"> | string
    employees_count?: IntFilter<"linkedin_info"> | number
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
    company_specialties_collection?: Company_specialtiesListRelationFilter
    company_featured_employees_collection?: Featured_employeesListRelationFilter
    locations_collection?: LocationsListRelationFilter
  }, "id" | "company_id">

  export type linkedin_infoOrderByWithAggregationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_size?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    linkedin_followers?: SortOrder
    founded?: SortOrder
    created?: SortOrder
    li_last_updated?: SortOrder
    type?: SortOrder
    employees_count?: SortOrder
    _count?: linkedin_infoCountOrderByAggregateInput
    _avg?: linkedin_infoAvgOrderByAggregateInput
    _max?: linkedin_infoMaxOrderByAggregateInput
    _min?: linkedin_infoMinOrderByAggregateInput
    _sum?: linkedin_infoSumOrderByAggregateInput
  }

  export type linkedin_infoScalarWhereWithAggregatesInput = {
    AND?: linkedin_infoScalarWhereWithAggregatesInput | linkedin_infoScalarWhereWithAggregatesInput[]
    OR?: linkedin_infoScalarWhereWithAggregatesInput[]
    NOT?: linkedin_infoScalarWhereWithAggregatesInput | linkedin_infoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"linkedin_info"> | string
    company_id?: UuidWithAggregatesFilter<"linkedin_info"> | string
    last_updated?: DateTimeWithAggregatesFilter<"linkedin_info"> | Date | string
    company_size?: StringWithAggregatesFilter<"linkedin_info"> | string
    industry?: StringWithAggregatesFilter<"linkedin_info"> | string
    description?: StringWithAggregatesFilter<"linkedin_info"> | string
    linkedin_followers?: IntWithAggregatesFilter<"linkedin_info"> | number
    founded?: IntWithAggregatesFilter<"linkedin_info"> | number
    created?: DateTimeWithAggregatesFilter<"linkedin_info"> | Date | string
    li_last_updated?: DateTimeWithAggregatesFilter<"linkedin_info"> | Date | string
    type?: StringWithAggregatesFilter<"linkedin_info"> | string
    employees_count?: IntWithAggregatesFilter<"linkedin_info"> | number
  }

  export type company_specialtiesWhereInput = {
    AND?: company_specialtiesWhereInput | company_specialtiesWhereInput[]
    OR?: company_specialtiesWhereInput[]
    NOT?: company_specialtiesWhereInput | company_specialtiesWhereInput[]
    id?: StringFilter<"company_specialties"> | string
    linkedin_info_id?: StringFilter<"company_specialties"> | string
    specialty?: StringFilter<"company_specialties"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }

  export type company_specialtiesOrderByWithRelationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    specialty?: SortOrder
    linkedin_info?: linkedin_infoOrderByWithRelationInput
  }

  export type company_specialtiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_linkedin_info_id?: company_specialtiesIdLinkedin_info_idCompoundUniqueInput
    AND?: company_specialtiesWhereInput | company_specialtiesWhereInput[]
    OR?: company_specialtiesWhereInput[]
    NOT?: company_specialtiesWhereInput | company_specialtiesWhereInput[]
    linkedin_info_id?: StringFilter<"company_specialties"> | string
    specialty?: StringFilter<"company_specialties"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }, "id" | "id_linkedin_info_id">

  export type company_specialtiesOrderByWithAggregationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    specialty?: SortOrder
    _count?: company_specialtiesCountOrderByAggregateInput
    _max?: company_specialtiesMaxOrderByAggregateInput
    _min?: company_specialtiesMinOrderByAggregateInput
  }

  export type company_specialtiesScalarWhereWithAggregatesInput = {
    AND?: company_specialtiesScalarWhereWithAggregatesInput | company_specialtiesScalarWhereWithAggregatesInput[]
    OR?: company_specialtiesScalarWhereWithAggregatesInput[]
    NOT?: company_specialtiesScalarWhereWithAggregatesInput | company_specialtiesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"company_specialties"> | string
    linkedin_info_id?: StringWithAggregatesFilter<"company_specialties"> | string
    specialty?: StringWithAggregatesFilter<"company_specialties"> | string
  }

  export type featured_employeesWhereInput = {
    AND?: featured_employeesWhereInput | featured_employeesWhereInput[]
    OR?: featured_employeesWhereInput[]
    NOT?: featured_employeesWhereInput | featured_employeesWhereInput[]
    id?: StringFilter<"featured_employees"> | string
    linkedin_info_id?: StringFilter<"featured_employees"> | string
    linkedin_url?: StringFilter<"featured_employees"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }

  export type featured_employeesOrderByWithRelationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    linkedin_url?: SortOrder
    linkedin_info?: linkedin_infoOrderByWithRelationInput
  }

  export type featured_employeesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_linkedin_info_id?: featured_employeesIdLinkedin_info_idCompoundUniqueInput
    AND?: featured_employeesWhereInput | featured_employeesWhereInput[]
    OR?: featured_employeesWhereInput[]
    NOT?: featured_employeesWhereInput | featured_employeesWhereInput[]
    linkedin_info_id?: StringFilter<"featured_employees"> | string
    linkedin_url?: StringFilter<"featured_employees"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }, "id" | "id_linkedin_info_id">

  export type featured_employeesOrderByWithAggregationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    linkedin_url?: SortOrder
    _count?: featured_employeesCountOrderByAggregateInput
    _max?: featured_employeesMaxOrderByAggregateInput
    _min?: featured_employeesMinOrderByAggregateInput
  }

  export type featured_employeesScalarWhereWithAggregatesInput = {
    AND?: featured_employeesScalarWhereWithAggregatesInput | featured_employeesScalarWhereWithAggregatesInput[]
    OR?: featured_employeesScalarWhereWithAggregatesInput[]
    NOT?: featured_employeesScalarWhereWithAggregatesInput | featured_employeesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"featured_employees"> | string
    linkedin_info_id?: StringWithAggregatesFilter<"featured_employees"> | string
    linkedin_url?: StringWithAggregatesFilter<"featured_employees"> | string
  }

  export type locationsWhereInput = {
    AND?: locationsWhereInput | locationsWhereInput[]
    OR?: locationsWhereInput[]
    NOT?: locationsWhereInput | locationsWhereInput[]
    id?: StringFilter<"locations"> | string
    linkedin_info_id?: StringFilter<"locations"> | string
    location_address?: StringFilter<"locations"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }

  export type locationsOrderByWithRelationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    location_address?: SortOrder
    linkedin_info?: linkedin_infoOrderByWithRelationInput
  }

  export type locationsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_linkedin_info_id?: locationsIdLinkedin_info_idCompoundUniqueInput
    AND?: locationsWhereInput | locationsWhereInput[]
    OR?: locationsWhereInput[]
    NOT?: locationsWhereInput | locationsWhereInput[]
    linkedin_info_id?: StringFilter<"locations"> | string
    location_address?: StringFilter<"locations"> | string
    linkedin_info?: XOR<Linkedin_infoRelationFilter, linkedin_infoWhereInput>
  }, "id" | "id_linkedin_info_id">

  export type locationsOrderByWithAggregationInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    location_address?: SortOrder
    _count?: locationsCountOrderByAggregateInput
    _max?: locationsMaxOrderByAggregateInput
    _min?: locationsMinOrderByAggregateInput
  }

  export type locationsScalarWhereWithAggregatesInput = {
    AND?: locationsScalarWhereWithAggregatesInput | locationsScalarWhereWithAggregatesInput[]
    OR?: locationsScalarWhereWithAggregatesInput[]
    NOT?: locationsScalarWhereWithAggregatesInput | locationsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"locations"> | string
    linkedin_info_id?: StringWithAggregatesFilter<"locations"> | string
    location_address?: StringWithAggregatesFilter<"locations"> | string
  }

  export type funding_infoWhereInput = {
    AND?: funding_infoWhereInput | funding_infoWhereInput[]
    OR?: funding_infoWhereInput[]
    NOT?: funding_infoWhereInput | funding_infoWhereInput[]
    id?: UuidFilter<"funding_info"> | string
    company_id?: UuidFilter<"funding_info"> | string
    last_updated?: DateTimeFilter<"funding_info"> | Date | string
    company_img_url?: StringFilter<"funding_info"> | string
    company_type?: StringFilter<"funding_info"> | string
    ipo_status?: StringFilter<"funding_info"> | string
    revenue_range?: StringFilter<"funding_info"> | string
    org_rank?: IntFilter<"funding_info"> | number
    num_articles?: IntFilter<"funding_info"> | number
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
    categories?: CategoriesListRelationFilter
    press_references?: Press_referencesListRelationFilter
    raised_funding_rounds?: Funding_roundsListRelationFilter
    founders?: FoundersListRelationFilter
  }

  export type funding_infoOrderByWithRelationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_img_url?: SortOrder
    company_type?: SortOrder
    ipo_status?: SortOrder
    revenue_range?: SortOrder
    org_rank?: SortOrder
    num_articles?: SortOrder
    vendor_company?: vendor_companiesOrderByWithRelationInput
    categories?: categoriesOrderByRelationAggregateInput
    press_references?: press_referencesOrderByRelationAggregateInput
    raised_funding_rounds?: funding_roundsOrderByRelationAggregateInput
    founders?: foundersOrderByRelationAggregateInput
  }

  export type funding_infoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    company_id?: string
    AND?: funding_infoWhereInput | funding_infoWhereInput[]
    OR?: funding_infoWhereInput[]
    NOT?: funding_infoWhereInput | funding_infoWhereInput[]
    last_updated?: DateTimeFilter<"funding_info"> | Date | string
    company_img_url?: StringFilter<"funding_info"> | string
    company_type?: StringFilter<"funding_info"> | string
    ipo_status?: StringFilter<"funding_info"> | string
    revenue_range?: StringFilter<"funding_info"> | string
    org_rank?: IntFilter<"funding_info"> | number
    num_articles?: IntFilter<"funding_info"> | number
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
    categories?: CategoriesListRelationFilter
    press_references?: Press_referencesListRelationFilter
    raised_funding_rounds?: Funding_roundsListRelationFilter
    founders?: FoundersListRelationFilter
  }, "id" | "company_id">

  export type funding_infoOrderByWithAggregationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_img_url?: SortOrder
    company_type?: SortOrder
    ipo_status?: SortOrder
    revenue_range?: SortOrder
    org_rank?: SortOrder
    num_articles?: SortOrder
    _count?: funding_infoCountOrderByAggregateInput
    _avg?: funding_infoAvgOrderByAggregateInput
    _max?: funding_infoMaxOrderByAggregateInput
    _min?: funding_infoMinOrderByAggregateInput
    _sum?: funding_infoSumOrderByAggregateInput
  }

  export type funding_infoScalarWhereWithAggregatesInput = {
    AND?: funding_infoScalarWhereWithAggregatesInput | funding_infoScalarWhereWithAggregatesInput[]
    OR?: funding_infoScalarWhereWithAggregatesInput[]
    NOT?: funding_infoScalarWhereWithAggregatesInput | funding_infoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"funding_info"> | string
    company_id?: UuidWithAggregatesFilter<"funding_info"> | string
    last_updated?: DateTimeWithAggregatesFilter<"funding_info"> | Date | string
    company_img_url?: StringWithAggregatesFilter<"funding_info"> | string
    company_type?: StringWithAggregatesFilter<"funding_info"> | string
    ipo_status?: StringWithAggregatesFilter<"funding_info"> | string
    revenue_range?: StringWithAggregatesFilter<"funding_info"> | string
    org_rank?: IntWithAggregatesFilter<"funding_info"> | number
    num_articles?: IntWithAggregatesFilter<"funding_info"> | number
  }

  export type categoriesWhereInput = {
    AND?: categoriesWhereInput | categoriesWhereInput[]
    OR?: categoriesWhereInput[]
    NOT?: categoriesWhereInput | categoriesWhereInput[]
    id?: StringFilter<"categories"> | string
    funding_info_id?: UuidFilter<"categories"> | string
    category?: StringFilter<"categories"> | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }

  export type categoriesOrderByWithRelationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    category?: SortOrder
    funding_info?: funding_infoOrderByWithRelationInput
  }

  export type categoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_funding_info_id?: categoriesIdFunding_info_idCompoundUniqueInput
    AND?: categoriesWhereInput | categoriesWhereInput[]
    OR?: categoriesWhereInput[]
    NOT?: categoriesWhereInput | categoriesWhereInput[]
    funding_info_id?: UuidFilter<"categories"> | string
    category?: StringFilter<"categories"> | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }, "id" | "id_funding_info_id">

  export type categoriesOrderByWithAggregationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    category?: SortOrder
    _count?: categoriesCountOrderByAggregateInput
    _max?: categoriesMaxOrderByAggregateInput
    _min?: categoriesMinOrderByAggregateInput
  }

  export type categoriesScalarWhereWithAggregatesInput = {
    AND?: categoriesScalarWhereWithAggregatesInput | categoriesScalarWhereWithAggregatesInput[]
    OR?: categoriesScalarWhereWithAggregatesInput[]
    NOT?: categoriesScalarWhereWithAggregatesInput | categoriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"categories"> | string
    funding_info_id?: UuidWithAggregatesFilter<"categories"> | string
    category?: StringWithAggregatesFilter<"categories"> | string
  }

  export type press_referencesWhereInput = {
    AND?: press_referencesWhereInput | press_referencesWhereInput[]
    OR?: press_referencesWhereInput[]
    NOT?: press_referencesWhereInput | press_referencesWhereInput[]
    id?: StringFilter<"press_references"> | string
    funding_info_id?: UuidFilter<"press_references"> | string
    author?: StringFilter<"press_references"> | string
    title?: StringFilter<"press_references"> | string
    publisher?: StringFilter<"press_references"> | string
    url?: StringFilter<"press_references"> | string
    posted_on?: DateTimeFilter<"press_references"> | Date | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }

  export type press_referencesOrderByWithRelationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    author?: SortOrder
    title?: SortOrder
    publisher?: SortOrder
    url?: SortOrder
    posted_on?: SortOrder
    funding_info?: funding_infoOrderByWithRelationInput
  }

  export type press_referencesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_funding_info_id?: press_referencesIdFunding_info_idCompoundUniqueInput
    AND?: press_referencesWhereInput | press_referencesWhereInput[]
    OR?: press_referencesWhereInput[]
    NOT?: press_referencesWhereInput | press_referencesWhereInput[]
    funding_info_id?: UuidFilter<"press_references"> | string
    author?: StringFilter<"press_references"> | string
    title?: StringFilter<"press_references"> | string
    publisher?: StringFilter<"press_references"> | string
    url?: StringFilter<"press_references"> | string
    posted_on?: DateTimeFilter<"press_references"> | Date | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }, "id" | "id_funding_info_id">

  export type press_referencesOrderByWithAggregationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    author?: SortOrder
    title?: SortOrder
    publisher?: SortOrder
    url?: SortOrder
    posted_on?: SortOrder
    _count?: press_referencesCountOrderByAggregateInput
    _max?: press_referencesMaxOrderByAggregateInput
    _min?: press_referencesMinOrderByAggregateInput
  }

  export type press_referencesScalarWhereWithAggregatesInput = {
    AND?: press_referencesScalarWhereWithAggregatesInput | press_referencesScalarWhereWithAggregatesInput[]
    OR?: press_referencesScalarWhereWithAggregatesInput[]
    NOT?: press_referencesScalarWhereWithAggregatesInput | press_referencesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"press_references"> | string
    funding_info_id?: UuidWithAggregatesFilter<"press_references"> | string
    author?: StringWithAggregatesFilter<"press_references"> | string
    title?: StringWithAggregatesFilter<"press_references"> | string
    publisher?: StringWithAggregatesFilter<"press_references"> | string
    url?: StringWithAggregatesFilter<"press_references"> | string
    posted_on?: DateTimeWithAggregatesFilter<"press_references"> | Date | string
  }

  export type funding_roundsWhereInput = {
    AND?: funding_roundsWhereInput | funding_roundsWhereInput[]
    OR?: funding_roundsWhereInput[]
    NOT?: funding_roundsWhereInput | funding_roundsWhereInput[]
    id?: StringFilter<"funding_rounds"> | string
    funding_info_id?: UuidFilter<"funding_rounds"> | string
    is_equity?: BoolFilter<"funding_rounds"> | boolean
    investment_stage?: StringFilter<"funding_rounds"> | string
    short_description?: StringFilter<"funding_rounds"> | string
    currency?: StringFilter<"funding_rounds"> | string
    money_raised?: IntFilter<"funding_rounds"> | number
    announced_on?: DateTimeFilter<"funding_rounds"> | Date | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }

  export type funding_roundsOrderByWithRelationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    is_equity?: SortOrder
    investment_stage?: SortOrder
    short_description?: SortOrder
    currency?: SortOrder
    money_raised?: SortOrder
    announced_on?: SortOrder
    funding_info?: funding_infoOrderByWithRelationInput
  }

  export type funding_roundsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_funding_info_id?: funding_roundsIdFunding_info_idCompoundUniqueInput
    AND?: funding_roundsWhereInput | funding_roundsWhereInput[]
    OR?: funding_roundsWhereInput[]
    NOT?: funding_roundsWhereInput | funding_roundsWhereInput[]
    funding_info_id?: UuidFilter<"funding_rounds"> | string
    is_equity?: BoolFilter<"funding_rounds"> | boolean
    investment_stage?: StringFilter<"funding_rounds"> | string
    short_description?: StringFilter<"funding_rounds"> | string
    currency?: StringFilter<"funding_rounds"> | string
    money_raised?: IntFilter<"funding_rounds"> | number
    announced_on?: DateTimeFilter<"funding_rounds"> | Date | string
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }, "id" | "id_funding_info_id">

  export type funding_roundsOrderByWithAggregationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    is_equity?: SortOrder
    investment_stage?: SortOrder
    short_description?: SortOrder
    currency?: SortOrder
    money_raised?: SortOrder
    announced_on?: SortOrder
    _count?: funding_roundsCountOrderByAggregateInput
    _avg?: funding_roundsAvgOrderByAggregateInput
    _max?: funding_roundsMaxOrderByAggregateInput
    _min?: funding_roundsMinOrderByAggregateInput
    _sum?: funding_roundsSumOrderByAggregateInput
  }

  export type funding_roundsScalarWhereWithAggregatesInput = {
    AND?: funding_roundsScalarWhereWithAggregatesInput | funding_roundsScalarWhereWithAggregatesInput[]
    OR?: funding_roundsScalarWhereWithAggregatesInput[]
    NOT?: funding_roundsScalarWhereWithAggregatesInput | funding_roundsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"funding_rounds"> | string
    funding_info_id?: UuidWithAggregatesFilter<"funding_rounds"> | string
    is_equity?: BoolWithAggregatesFilter<"funding_rounds"> | boolean
    investment_stage?: StringWithAggregatesFilter<"funding_rounds"> | string
    short_description?: StringWithAggregatesFilter<"funding_rounds"> | string
    currency?: StringWithAggregatesFilter<"funding_rounds"> | string
    money_raised?: IntWithAggregatesFilter<"funding_rounds"> | number
    announced_on?: DateTimeWithAggregatesFilter<"funding_rounds"> | Date | string
  }

  export type foundersWhereInput = {
    AND?: foundersWhereInput | foundersWhereInput[]
    OR?: foundersWhereInput[]
    NOT?: foundersWhereInput | foundersWhereInput[]
    id?: StringFilter<"founders"> | string
    funding_info_id?: UuidFilter<"founders"> | string
    full_name?: StringFilter<"founders"> | string
    primary_job_title?: StringFilter<"founders"> | string
    description?: StringFilter<"founders"> | string
    linkedin?: StringFilter<"founders"> | string
    num_founded_organizations?: IntFilter<"founders"> | number
    rank_person?: IntFilter<"founders"> | number
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }

  export type foundersOrderByWithRelationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    full_name?: SortOrder
    primary_job_title?: SortOrder
    description?: SortOrder
    linkedin?: SortOrder
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
    funding_info?: funding_infoOrderByWithRelationInput
  }

  export type foundersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_funding_info_id?: foundersIdFunding_info_idCompoundUniqueInput
    AND?: foundersWhereInput | foundersWhereInput[]
    OR?: foundersWhereInput[]
    NOT?: foundersWhereInput | foundersWhereInput[]
    funding_info_id?: UuidFilter<"founders"> | string
    full_name?: StringFilter<"founders"> | string
    primary_job_title?: StringFilter<"founders"> | string
    description?: StringFilter<"founders"> | string
    linkedin?: StringFilter<"founders"> | string
    num_founded_organizations?: IntFilter<"founders"> | number
    rank_person?: IntFilter<"founders"> | number
    funding_info?: XOR<Funding_infoRelationFilter, funding_infoWhereInput>
  }, "id" | "id_funding_info_id">

  export type foundersOrderByWithAggregationInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    full_name?: SortOrder
    primary_job_title?: SortOrder
    description?: SortOrder
    linkedin?: SortOrder
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
    _count?: foundersCountOrderByAggregateInput
    _avg?: foundersAvgOrderByAggregateInput
    _max?: foundersMaxOrderByAggregateInput
    _min?: foundersMinOrderByAggregateInput
    _sum?: foundersSumOrderByAggregateInput
  }

  export type foundersScalarWhereWithAggregatesInput = {
    AND?: foundersScalarWhereWithAggregatesInput | foundersScalarWhereWithAggregatesInput[]
    OR?: foundersScalarWhereWithAggregatesInput[]
    NOT?: foundersScalarWhereWithAggregatesInput | foundersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"founders"> | string
    funding_info_id?: UuidWithAggregatesFilter<"founders"> | string
    full_name?: StringWithAggregatesFilter<"founders"> | string
    primary_job_title?: StringWithAggregatesFilter<"founders"> | string
    description?: StringWithAggregatesFilter<"founders"> | string
    linkedin?: StringWithAggregatesFilter<"founders"> | string
    num_founded_organizations?: IntWithAggregatesFilter<"founders"> | number
    rank_person?: IntWithAggregatesFilter<"founders"> | number
  }

  export type website_infoWhereInput = {
    AND?: website_infoWhereInput | website_infoWhereInput[]
    OR?: website_infoWhereInput[]
    NOT?: website_infoWhereInput | website_infoWhereInput[]
    id?: UuidFilter<"website_info"> | string
    company_id?: UuidFilter<"website_info"> | string
    last_updated?: DateTimeFilter<"website_info"> | Date | string
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
  }

  export type website_infoOrderByWithRelationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    vendor_company?: vendor_companiesOrderByWithRelationInput
  }

  export type website_infoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    company_id?: string
    AND?: website_infoWhereInput | website_infoWhereInput[]
    OR?: website_infoWhereInput[]
    NOT?: website_infoWhereInput | website_infoWhereInput[]
    last_updated?: DateTimeFilter<"website_info"> | Date | string
    vendor_company?: XOR<Vendor_companiesRelationFilter, vendor_companiesWhereInput>
  }, "id" | "company_id">

  export type website_infoOrderByWithAggregationInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    _count?: website_infoCountOrderByAggregateInput
    _max?: website_infoMaxOrderByAggregateInput
    _min?: website_infoMinOrderByAggregateInput
  }

  export type website_infoScalarWhereWithAggregatesInput = {
    AND?: website_infoScalarWhereWithAggregatesInput | website_infoScalarWhereWithAggregatesInput[]
    OR?: website_infoScalarWhereWithAggregatesInput[]
    NOT?: website_infoScalarWhereWithAggregatesInput | website_infoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"website_info"> | string
    company_id?: UuidWithAggregatesFilter<"website_info"> | string
    last_updated?: DateTimeWithAggregatesFilter<"website_info"> | Date | string
  }

  export type vendor_companiesCreateInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUncheckedCreateInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoUncheckedCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesCreateManyInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
  }

  export type vendor_companiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type vendor_companiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type traffic_infoCreateInput = {
    id?: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
    vendor_company: vendor_companiesCreateNestedOneWithoutTraffic_infoInput
  }

  export type traffic_infoUncheckedCreateInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
  }

  export type traffic_infoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutTraffic_infoNestedInput
  }

  export type traffic_infoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type traffic_infoCreateManyInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
  }

  export type traffic_infoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type traffic_infoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type linkedin_infoCreateInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    vendor_company: vendor_companiesCreateNestedOneWithoutLinkedin_infoInput
    company_specialties_collection?: company_specialtiesCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUncheckedCreateInput = {
    id: string
    company_id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_specialties_collection?: company_specialtiesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsUncheckedCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutLinkedin_infoNestedInput
    company_specialties_collection?: company_specialtiesUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_specialties_collection?: company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUncheckedUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoCreateManyInput = {
    id: string
    company_id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
  }

  export type linkedin_infoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
  }

  export type linkedin_infoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
  }

  export type company_specialtiesCreateInput = {
    id: string
    specialty: string
    linkedin_info: linkedin_infoCreateNestedOneWithoutCompany_specialties_collectionInput
  }

  export type company_specialtiesUncheckedCreateInput = {
    id: string
    linkedin_info_id: string
    specialty: string
  }

  export type company_specialtiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    linkedin_info?: linkedin_infoUpdateOneRequiredWithoutCompany_specialties_collectionNestedInput
  }

  export type company_specialtiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type company_specialtiesCreateManyInput = {
    id: string
    linkedin_info_id: string
    specialty: string
  }

  export type company_specialtiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type company_specialtiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesCreateInput = {
    id: string
    linkedin_url: string
    linkedin_info: linkedin_infoCreateNestedOneWithoutCompany_featured_employees_collectionInput
  }

  export type featured_employeesUncheckedCreateInput = {
    id: string
    linkedin_info_id: string
    linkedin_url: string
  }

  export type featured_employeesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    linkedin_info?: linkedin_infoUpdateOneRequiredWithoutCompany_featured_employees_collectionNestedInput
  }

  export type featured_employeesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesCreateManyInput = {
    id: string
    linkedin_info_id: string
    linkedin_url: string
  }

  export type featured_employeesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type locationsCreateInput = {
    id: string
    location_address: string
    linkedin_info: linkedin_infoCreateNestedOneWithoutLocations_collectionInput
  }

  export type locationsUncheckedCreateInput = {
    id: string
    linkedin_info_id: string
    location_address: string
  }

  export type locationsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
    linkedin_info?: linkedin_infoUpdateOneRequiredWithoutLocations_collectionNestedInput
  }

  export type locationsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type locationsCreateManyInput = {
    id: string
    linkedin_info_id: string
    location_address: string
  }

  export type locationsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type locationsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_info_id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type funding_infoCreateInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    vendor_company: vendor_companiesCreateNestedOneWithoutFunding_infoInput
    categories?: categoriesCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsCreateNestedManyWithoutFunding_infoInput
    founders?: foundersCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesUncheckedCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput
    founders?: foundersUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput
    categories?: categoriesUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoCreateManyInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
  }

  export type funding_infoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
  }

  export type funding_infoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
  }

  export type categoriesCreateInput = {
    id?: string
    category: string
    funding_info: funding_infoCreateNestedOneWithoutCategoriesInput
  }

  export type categoriesUncheckedCreateInput = {
    id?: string
    funding_info_id: string
    category: string
  }

  export type categoriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    funding_info?: funding_infoUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type categoriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type categoriesCreateManyInput = {
    id?: string
    funding_info_id: string
    category: string
  }

  export type categoriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type categoriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type press_referencesCreateInput = {
    id?: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
    funding_info: funding_infoCreateNestedOneWithoutPress_referencesInput
  }

  export type press_referencesUncheckedCreateInput = {
    id?: string
    funding_info_id: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
  }

  export type press_referencesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
    funding_info?: funding_infoUpdateOneRequiredWithoutPress_referencesNestedInput
  }

  export type press_referencesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type press_referencesCreateManyInput = {
    id?: string
    funding_info_id: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
  }

  export type press_referencesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type press_referencesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsCreateInput = {
    id?: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
    funding_info: funding_infoCreateNestedOneWithoutRaised_funding_roundsInput
  }

  export type funding_roundsUncheckedCreateInput = {
    id?: string
    funding_info_id: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
  }

  export type funding_roundsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
    funding_info?: funding_infoUpdateOneRequiredWithoutRaised_funding_roundsNestedInput
  }

  export type funding_roundsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsCreateManyInput = {
    id?: string
    funding_info_id: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
  }

  export type funding_roundsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type foundersCreateInput = {
    id?: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
    funding_info: funding_infoCreateNestedOneWithoutFoundersInput
  }

  export type foundersUncheckedCreateInput = {
    id?: string
    funding_info_id: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
  }

  export type foundersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
    funding_info?: funding_infoUpdateOneRequiredWithoutFoundersNestedInput
  }

  export type foundersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }

  export type foundersCreateManyInput = {
    id?: string
    funding_info_id: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
  }

  export type foundersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }

  export type foundersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funding_info_id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }

  export type website_infoCreateInput = {
    id?: string
    last_updated?: Date | string
    vendor_company: vendor_companiesCreateNestedOneWithoutWebsite_infoInput
  }

  export type website_infoUncheckedCreateInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
  }

  export type website_infoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutWebsite_infoNestedInput
  }

  export type website_infoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type website_infoCreateManyInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
  }

  export type website_infoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type website_infoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type Traffic_infoListRelationFilter = {
    every?: traffic_infoWhereInput
    some?: traffic_infoWhereInput
    none?: traffic_infoWhereInput
  }

  export type Linkedin_infoListRelationFilter = {
    every?: linkedin_infoWhereInput
    some?: linkedin_infoWhereInput
    none?: linkedin_infoWhereInput
  }

  export type Funding_infoListRelationFilter = {
    every?: funding_infoWhereInput
    some?: funding_infoWhereInput
    none?: funding_infoWhereInput
  }

  export type Website_infoListRelationFilter = {
    every?: website_infoWhereInput
    some?: website_infoWhereInput
    none?: website_infoWhereInput
  }

  export type traffic_infoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type linkedin_infoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type funding_infoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type website_infoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type vendor_companiesCountOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    website_url?: SortOrder
    linkedin_url?: SortOrder
    type?: SortOrder
    is_active?: SortOrder
    is_cromatic_vendor?: SortOrder
  }

  export type vendor_companiesMaxOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    website_url?: SortOrder
    linkedin_url?: SortOrder
    type?: SortOrder
    is_active?: SortOrder
    is_cromatic_vendor?: SortOrder
  }

  export type vendor_companiesMinOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    website_url?: SortOrder
    linkedin_url?: SortOrder
    type?: SortOrder
    is_active?: SortOrder
    is_cromatic_vendor?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type Vendor_companiesRelationFilter = {
    is?: vendor_companiesWhereInput
    isNot?: vendor_companiesWhereInput
  }

  export type traffic_infoCountOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    display_date?: SortOrder
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
    categories?: SortOrder
  }

  export type traffic_infoAvgOrderByAggregateInput = {
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
  }

  export type traffic_infoMaxOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    display_date?: SortOrder
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
    categories?: SortOrder
  }

  export type traffic_infoMinOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    display_date?: SortOrder
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
    categories?: SortOrder
  }

  export type traffic_infoSumOrderByAggregateInput = {
    rank?: SortOrder
    visits?: SortOrder
    users?: SortOrder
    search_organic?: SortOrder
    search_paid?: SortOrder
    social_organic?: SortOrder
    social_paid?: SortOrder
    referral?: SortOrder
    time_on_site?: SortOrder
    pages_per_visit?: SortOrder
    bounce_rate?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type Company_specialtiesListRelationFilter = {
    every?: company_specialtiesWhereInput
    some?: company_specialtiesWhereInput
    none?: company_specialtiesWhereInput
  }

  export type Featured_employeesListRelationFilter = {
    every?: featured_employeesWhereInput
    some?: featured_employeesWhereInput
    none?: featured_employeesWhereInput
  }

  export type LocationsListRelationFilter = {
    every?: locationsWhereInput
    some?: locationsWhereInput
    none?: locationsWhereInput
  }

  export type company_specialtiesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type featured_employeesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type locationsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type linkedin_infoCountOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_size?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    linkedin_followers?: SortOrder
    founded?: SortOrder
    created?: SortOrder
    li_last_updated?: SortOrder
    type?: SortOrder
    employees_count?: SortOrder
  }

  export type linkedin_infoAvgOrderByAggregateInput = {
    linkedin_followers?: SortOrder
    founded?: SortOrder
    employees_count?: SortOrder
  }

  export type linkedin_infoMaxOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_size?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    linkedin_followers?: SortOrder
    founded?: SortOrder
    created?: SortOrder
    li_last_updated?: SortOrder
    type?: SortOrder
    employees_count?: SortOrder
  }

  export type linkedin_infoMinOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_size?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    linkedin_followers?: SortOrder
    founded?: SortOrder
    created?: SortOrder
    li_last_updated?: SortOrder
    type?: SortOrder
    employees_count?: SortOrder
  }

  export type linkedin_infoSumOrderByAggregateInput = {
    linkedin_followers?: SortOrder
    founded?: SortOrder
    employees_count?: SortOrder
  }

  export type Linkedin_infoRelationFilter = {
    is?: linkedin_infoWhereInput
    isNot?: linkedin_infoWhereInput
  }

  export type company_specialtiesIdLinkedin_info_idCompoundUniqueInput = {
    id: string
    linkedin_info_id: string
  }

  export type company_specialtiesCountOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    specialty?: SortOrder
  }

  export type company_specialtiesMaxOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    specialty?: SortOrder
  }

  export type company_specialtiesMinOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    specialty?: SortOrder
  }

  export type featured_employeesIdLinkedin_info_idCompoundUniqueInput = {
    id: string
    linkedin_info_id: string
  }

  export type featured_employeesCountOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    linkedin_url?: SortOrder
  }

  export type featured_employeesMaxOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    linkedin_url?: SortOrder
  }

  export type featured_employeesMinOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    linkedin_url?: SortOrder
  }

  export type locationsIdLinkedin_info_idCompoundUniqueInput = {
    id: string
    linkedin_info_id: string
  }

  export type locationsCountOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    location_address?: SortOrder
  }

  export type locationsMaxOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    location_address?: SortOrder
  }

  export type locationsMinOrderByAggregateInput = {
    id?: SortOrder
    linkedin_info_id?: SortOrder
    location_address?: SortOrder
  }

  export type CategoriesListRelationFilter = {
    every?: categoriesWhereInput
    some?: categoriesWhereInput
    none?: categoriesWhereInput
  }

  export type Press_referencesListRelationFilter = {
    every?: press_referencesWhereInput
    some?: press_referencesWhereInput
    none?: press_referencesWhereInput
  }

  export type Funding_roundsListRelationFilter = {
    every?: funding_roundsWhereInput
    some?: funding_roundsWhereInput
    none?: funding_roundsWhereInput
  }

  export type FoundersListRelationFilter = {
    every?: foundersWhereInput
    some?: foundersWhereInput
    none?: foundersWhereInput
  }

  export type categoriesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type press_referencesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type funding_roundsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type foundersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type funding_infoCountOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_img_url?: SortOrder
    company_type?: SortOrder
    ipo_status?: SortOrder
    revenue_range?: SortOrder
    org_rank?: SortOrder
    num_articles?: SortOrder
  }

  export type funding_infoAvgOrderByAggregateInput = {
    org_rank?: SortOrder
    num_articles?: SortOrder
  }

  export type funding_infoMaxOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_img_url?: SortOrder
    company_type?: SortOrder
    ipo_status?: SortOrder
    revenue_range?: SortOrder
    org_rank?: SortOrder
    num_articles?: SortOrder
  }

  export type funding_infoMinOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
    company_img_url?: SortOrder
    company_type?: SortOrder
    ipo_status?: SortOrder
    revenue_range?: SortOrder
    org_rank?: SortOrder
    num_articles?: SortOrder
  }

  export type funding_infoSumOrderByAggregateInput = {
    org_rank?: SortOrder
    num_articles?: SortOrder
  }

  export type Funding_infoRelationFilter = {
    is?: funding_infoWhereInput
    isNot?: funding_infoWhereInput
  }

  export type categoriesIdFunding_info_idCompoundUniqueInput = {
    id: string
    funding_info_id: string
  }

  export type categoriesCountOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    category?: SortOrder
  }

  export type categoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    category?: SortOrder
  }

  export type categoriesMinOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    category?: SortOrder
  }

  export type press_referencesIdFunding_info_idCompoundUniqueInput = {
    id: string
    funding_info_id: string
  }

  export type press_referencesCountOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    author?: SortOrder
    title?: SortOrder
    publisher?: SortOrder
    url?: SortOrder
    posted_on?: SortOrder
  }

  export type press_referencesMaxOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    author?: SortOrder
    title?: SortOrder
    publisher?: SortOrder
    url?: SortOrder
    posted_on?: SortOrder
  }

  export type press_referencesMinOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    author?: SortOrder
    title?: SortOrder
    publisher?: SortOrder
    url?: SortOrder
    posted_on?: SortOrder
  }

  export type funding_roundsIdFunding_info_idCompoundUniqueInput = {
    id: string
    funding_info_id: string
  }

  export type funding_roundsCountOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    is_equity?: SortOrder
    investment_stage?: SortOrder
    short_description?: SortOrder
    currency?: SortOrder
    money_raised?: SortOrder
    announced_on?: SortOrder
  }

  export type funding_roundsAvgOrderByAggregateInput = {
    money_raised?: SortOrder
  }

  export type funding_roundsMaxOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    is_equity?: SortOrder
    investment_stage?: SortOrder
    short_description?: SortOrder
    currency?: SortOrder
    money_raised?: SortOrder
    announced_on?: SortOrder
  }

  export type funding_roundsMinOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    is_equity?: SortOrder
    investment_stage?: SortOrder
    short_description?: SortOrder
    currency?: SortOrder
    money_raised?: SortOrder
    announced_on?: SortOrder
  }

  export type funding_roundsSumOrderByAggregateInput = {
    money_raised?: SortOrder
  }

  export type foundersIdFunding_info_idCompoundUniqueInput = {
    id: string
    funding_info_id: string
  }

  export type foundersCountOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    full_name?: SortOrder
    primary_job_title?: SortOrder
    description?: SortOrder
    linkedin?: SortOrder
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
  }

  export type foundersAvgOrderByAggregateInput = {
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
  }

  export type foundersMaxOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    full_name?: SortOrder
    primary_job_title?: SortOrder
    description?: SortOrder
    linkedin?: SortOrder
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
  }

  export type foundersMinOrderByAggregateInput = {
    id?: SortOrder
    funding_info_id?: SortOrder
    full_name?: SortOrder
    primary_job_title?: SortOrder
    description?: SortOrder
    linkedin?: SortOrder
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
  }

  export type foundersSumOrderByAggregateInput = {
    num_founded_organizations?: SortOrder
    rank_person?: SortOrder
  }

  export type website_infoCountOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
  }

  export type website_infoMaxOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
  }

  export type website_infoMinOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    last_updated?: SortOrder
  }

  export type traffic_infoCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput> | traffic_infoCreateWithoutVendor_companyInput[] | traffic_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: traffic_infoCreateOrConnectWithoutVendor_companyInput | traffic_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: traffic_infoCreateManyVendor_companyInputEnvelope
    connect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
  }

  export type linkedin_infoCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput> | linkedin_infoCreateWithoutVendor_companyInput[] | linkedin_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutVendor_companyInput | linkedin_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: linkedin_infoCreateManyVendor_companyInputEnvelope
    connect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
  }

  export type funding_infoCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput> | funding_infoCreateWithoutVendor_companyInput[] | funding_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: funding_infoCreateOrConnectWithoutVendor_companyInput | funding_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: funding_infoCreateManyVendor_companyInputEnvelope
    connect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
  }

  export type website_infoCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput> | website_infoCreateWithoutVendor_companyInput[] | website_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: website_infoCreateOrConnectWithoutVendor_companyInput | website_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: website_infoCreateManyVendor_companyInputEnvelope
    connect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
  }

  export type traffic_infoUncheckedCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput> | traffic_infoCreateWithoutVendor_companyInput[] | traffic_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: traffic_infoCreateOrConnectWithoutVendor_companyInput | traffic_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: traffic_infoCreateManyVendor_companyInputEnvelope
    connect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
  }

  export type linkedin_infoUncheckedCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput> | linkedin_infoCreateWithoutVendor_companyInput[] | linkedin_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutVendor_companyInput | linkedin_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: linkedin_infoCreateManyVendor_companyInputEnvelope
    connect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
  }

  export type funding_infoUncheckedCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput> | funding_infoCreateWithoutVendor_companyInput[] | funding_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: funding_infoCreateOrConnectWithoutVendor_companyInput | funding_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: funding_infoCreateManyVendor_companyInputEnvelope
    connect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
  }

  export type website_infoUncheckedCreateNestedManyWithoutVendor_companyInput = {
    create?: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput> | website_infoCreateWithoutVendor_companyInput[] | website_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: website_infoCreateOrConnectWithoutVendor_companyInput | website_infoCreateOrConnectWithoutVendor_companyInput[]
    createMany?: website_infoCreateManyVendor_companyInputEnvelope
    connect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type traffic_infoUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput> | traffic_infoCreateWithoutVendor_companyInput[] | traffic_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: traffic_infoCreateOrConnectWithoutVendor_companyInput | traffic_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: traffic_infoUpsertWithWhereUniqueWithoutVendor_companyInput | traffic_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: traffic_infoCreateManyVendor_companyInputEnvelope
    set?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    disconnect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    delete?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    connect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    update?: traffic_infoUpdateWithWhereUniqueWithoutVendor_companyInput | traffic_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: traffic_infoUpdateManyWithWhereWithoutVendor_companyInput | traffic_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: traffic_infoScalarWhereInput | traffic_infoScalarWhereInput[]
  }

  export type linkedin_infoUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput> | linkedin_infoCreateWithoutVendor_companyInput[] | linkedin_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutVendor_companyInput | linkedin_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: linkedin_infoUpsertWithWhereUniqueWithoutVendor_companyInput | linkedin_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: linkedin_infoCreateManyVendor_companyInputEnvelope
    set?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    disconnect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    delete?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    connect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    update?: linkedin_infoUpdateWithWhereUniqueWithoutVendor_companyInput | linkedin_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: linkedin_infoUpdateManyWithWhereWithoutVendor_companyInput | linkedin_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: linkedin_infoScalarWhereInput | linkedin_infoScalarWhereInput[]
  }

  export type funding_infoUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput> | funding_infoCreateWithoutVendor_companyInput[] | funding_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: funding_infoCreateOrConnectWithoutVendor_companyInput | funding_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: funding_infoUpsertWithWhereUniqueWithoutVendor_companyInput | funding_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: funding_infoCreateManyVendor_companyInputEnvelope
    set?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    disconnect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    delete?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    connect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    update?: funding_infoUpdateWithWhereUniqueWithoutVendor_companyInput | funding_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: funding_infoUpdateManyWithWhereWithoutVendor_companyInput | funding_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: funding_infoScalarWhereInput | funding_infoScalarWhereInput[]
  }

  export type website_infoUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput> | website_infoCreateWithoutVendor_companyInput[] | website_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: website_infoCreateOrConnectWithoutVendor_companyInput | website_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: website_infoUpsertWithWhereUniqueWithoutVendor_companyInput | website_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: website_infoCreateManyVendor_companyInputEnvelope
    set?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    disconnect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    delete?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    connect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    update?: website_infoUpdateWithWhereUniqueWithoutVendor_companyInput | website_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: website_infoUpdateManyWithWhereWithoutVendor_companyInput | website_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: website_infoScalarWhereInput | website_infoScalarWhereInput[]
  }

  export type traffic_infoUncheckedUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput> | traffic_infoCreateWithoutVendor_companyInput[] | traffic_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: traffic_infoCreateOrConnectWithoutVendor_companyInput | traffic_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: traffic_infoUpsertWithWhereUniqueWithoutVendor_companyInput | traffic_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: traffic_infoCreateManyVendor_companyInputEnvelope
    set?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    disconnect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    delete?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    connect?: traffic_infoWhereUniqueInput | traffic_infoWhereUniqueInput[]
    update?: traffic_infoUpdateWithWhereUniqueWithoutVendor_companyInput | traffic_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: traffic_infoUpdateManyWithWhereWithoutVendor_companyInput | traffic_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: traffic_infoScalarWhereInput | traffic_infoScalarWhereInput[]
  }

  export type linkedin_infoUncheckedUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput> | linkedin_infoCreateWithoutVendor_companyInput[] | linkedin_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutVendor_companyInput | linkedin_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: linkedin_infoUpsertWithWhereUniqueWithoutVendor_companyInput | linkedin_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: linkedin_infoCreateManyVendor_companyInputEnvelope
    set?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    disconnect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    delete?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    connect?: linkedin_infoWhereUniqueInput | linkedin_infoWhereUniqueInput[]
    update?: linkedin_infoUpdateWithWhereUniqueWithoutVendor_companyInput | linkedin_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: linkedin_infoUpdateManyWithWhereWithoutVendor_companyInput | linkedin_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: linkedin_infoScalarWhereInput | linkedin_infoScalarWhereInput[]
  }

  export type funding_infoUncheckedUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput> | funding_infoCreateWithoutVendor_companyInput[] | funding_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: funding_infoCreateOrConnectWithoutVendor_companyInput | funding_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: funding_infoUpsertWithWhereUniqueWithoutVendor_companyInput | funding_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: funding_infoCreateManyVendor_companyInputEnvelope
    set?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    disconnect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    delete?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    connect?: funding_infoWhereUniqueInput | funding_infoWhereUniqueInput[]
    update?: funding_infoUpdateWithWhereUniqueWithoutVendor_companyInput | funding_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: funding_infoUpdateManyWithWhereWithoutVendor_companyInput | funding_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: funding_infoScalarWhereInput | funding_infoScalarWhereInput[]
  }

  export type website_infoUncheckedUpdateManyWithoutVendor_companyNestedInput = {
    create?: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput> | website_infoCreateWithoutVendor_companyInput[] | website_infoUncheckedCreateWithoutVendor_companyInput[]
    connectOrCreate?: website_infoCreateOrConnectWithoutVendor_companyInput | website_infoCreateOrConnectWithoutVendor_companyInput[]
    upsert?: website_infoUpsertWithWhereUniqueWithoutVendor_companyInput | website_infoUpsertWithWhereUniqueWithoutVendor_companyInput[]
    createMany?: website_infoCreateManyVendor_companyInputEnvelope
    set?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    disconnect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    delete?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    connect?: website_infoWhereUniqueInput | website_infoWhereUniqueInput[]
    update?: website_infoUpdateWithWhereUniqueWithoutVendor_companyInput | website_infoUpdateWithWhereUniqueWithoutVendor_companyInput[]
    updateMany?: website_infoUpdateManyWithWhereWithoutVendor_companyInput | website_infoUpdateManyWithWhereWithoutVendor_companyInput[]
    deleteMany?: website_infoScalarWhereInput | website_infoScalarWhereInput[]
  }

  export type vendor_companiesCreateNestedOneWithoutTraffic_infoInput = {
    create?: XOR<vendor_companiesCreateWithoutTraffic_infoInput, vendor_companiesUncheckedCreateWithoutTraffic_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutTraffic_infoInput
    connect?: vendor_companiesWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type vendor_companiesUpdateOneRequiredWithoutTraffic_infoNestedInput = {
    create?: XOR<vendor_companiesCreateWithoutTraffic_infoInput, vendor_companiesUncheckedCreateWithoutTraffic_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutTraffic_infoInput
    upsert?: vendor_companiesUpsertWithoutTraffic_infoInput
    connect?: vendor_companiesWhereUniqueInput
    update?: XOR<XOR<vendor_companiesUpdateToOneWithWhereWithoutTraffic_infoInput, vendor_companiesUpdateWithoutTraffic_infoInput>, vendor_companiesUncheckedUpdateWithoutTraffic_infoInput>
  }

  export type vendor_companiesCreateNestedOneWithoutLinkedin_infoInput = {
    create?: XOR<vendor_companiesCreateWithoutLinkedin_infoInput, vendor_companiesUncheckedCreateWithoutLinkedin_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutLinkedin_infoInput
    connect?: vendor_companiesWhereUniqueInput
  }

  export type company_specialtiesCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput> | company_specialtiesCreateWithoutLinkedin_infoInput[] | company_specialtiesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: company_specialtiesCreateOrConnectWithoutLinkedin_infoInput | company_specialtiesCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: company_specialtiesCreateManyLinkedin_infoInputEnvelope
    connect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
  }

  export type featured_employeesCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput> | featured_employeesCreateWithoutLinkedin_infoInput[] | featured_employeesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: featured_employeesCreateOrConnectWithoutLinkedin_infoInput | featured_employeesCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: featured_employeesCreateManyLinkedin_infoInputEnvelope
    connect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
  }

  export type locationsCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput> | locationsCreateWithoutLinkedin_infoInput[] | locationsUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: locationsCreateOrConnectWithoutLinkedin_infoInput | locationsCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: locationsCreateManyLinkedin_infoInputEnvelope
    connect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
  }

  export type company_specialtiesUncheckedCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput> | company_specialtiesCreateWithoutLinkedin_infoInput[] | company_specialtiesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: company_specialtiesCreateOrConnectWithoutLinkedin_infoInput | company_specialtiesCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: company_specialtiesCreateManyLinkedin_infoInputEnvelope
    connect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
  }

  export type featured_employeesUncheckedCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput> | featured_employeesCreateWithoutLinkedin_infoInput[] | featured_employeesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: featured_employeesCreateOrConnectWithoutLinkedin_infoInput | featured_employeesCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: featured_employeesCreateManyLinkedin_infoInputEnvelope
    connect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
  }

  export type locationsUncheckedCreateNestedManyWithoutLinkedin_infoInput = {
    create?: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput> | locationsCreateWithoutLinkedin_infoInput[] | locationsUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: locationsCreateOrConnectWithoutLinkedin_infoInput | locationsCreateOrConnectWithoutLinkedin_infoInput[]
    createMany?: locationsCreateManyLinkedin_infoInputEnvelope
    connect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
  }

  export type vendor_companiesUpdateOneRequiredWithoutLinkedin_infoNestedInput = {
    create?: XOR<vendor_companiesCreateWithoutLinkedin_infoInput, vendor_companiesUncheckedCreateWithoutLinkedin_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutLinkedin_infoInput
    upsert?: vendor_companiesUpsertWithoutLinkedin_infoInput
    connect?: vendor_companiesWhereUniqueInput
    update?: XOR<XOR<vendor_companiesUpdateToOneWithWhereWithoutLinkedin_infoInput, vendor_companiesUpdateWithoutLinkedin_infoInput>, vendor_companiesUncheckedUpdateWithoutLinkedin_infoInput>
  }

  export type company_specialtiesUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput> | company_specialtiesCreateWithoutLinkedin_infoInput[] | company_specialtiesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: company_specialtiesCreateOrConnectWithoutLinkedin_infoInput | company_specialtiesCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: company_specialtiesUpsertWithWhereUniqueWithoutLinkedin_infoInput | company_specialtiesUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: company_specialtiesCreateManyLinkedin_infoInputEnvelope
    set?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    disconnect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    delete?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    connect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    update?: company_specialtiesUpdateWithWhereUniqueWithoutLinkedin_infoInput | company_specialtiesUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: company_specialtiesUpdateManyWithWhereWithoutLinkedin_infoInput | company_specialtiesUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: company_specialtiesScalarWhereInput | company_specialtiesScalarWhereInput[]
  }

  export type featured_employeesUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput> | featured_employeesCreateWithoutLinkedin_infoInput[] | featured_employeesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: featured_employeesCreateOrConnectWithoutLinkedin_infoInput | featured_employeesCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: featured_employeesUpsertWithWhereUniqueWithoutLinkedin_infoInput | featured_employeesUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: featured_employeesCreateManyLinkedin_infoInputEnvelope
    set?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    disconnect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    delete?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    connect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    update?: featured_employeesUpdateWithWhereUniqueWithoutLinkedin_infoInput | featured_employeesUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: featured_employeesUpdateManyWithWhereWithoutLinkedin_infoInput | featured_employeesUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: featured_employeesScalarWhereInput | featured_employeesScalarWhereInput[]
  }

  export type locationsUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput> | locationsCreateWithoutLinkedin_infoInput[] | locationsUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: locationsCreateOrConnectWithoutLinkedin_infoInput | locationsCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: locationsUpsertWithWhereUniqueWithoutLinkedin_infoInput | locationsUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: locationsCreateManyLinkedin_infoInputEnvelope
    set?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    disconnect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    delete?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    connect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    update?: locationsUpdateWithWhereUniqueWithoutLinkedin_infoInput | locationsUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: locationsUpdateManyWithWhereWithoutLinkedin_infoInput | locationsUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: locationsScalarWhereInput | locationsScalarWhereInput[]
  }

  export type company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput> | company_specialtiesCreateWithoutLinkedin_infoInput[] | company_specialtiesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: company_specialtiesCreateOrConnectWithoutLinkedin_infoInput | company_specialtiesCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: company_specialtiesUpsertWithWhereUniqueWithoutLinkedin_infoInput | company_specialtiesUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: company_specialtiesCreateManyLinkedin_infoInputEnvelope
    set?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    disconnect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    delete?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    connect?: company_specialtiesWhereUniqueInput | company_specialtiesWhereUniqueInput[]
    update?: company_specialtiesUpdateWithWhereUniqueWithoutLinkedin_infoInput | company_specialtiesUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: company_specialtiesUpdateManyWithWhereWithoutLinkedin_infoInput | company_specialtiesUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: company_specialtiesScalarWhereInput | company_specialtiesScalarWhereInput[]
  }

  export type featured_employeesUncheckedUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput> | featured_employeesCreateWithoutLinkedin_infoInput[] | featured_employeesUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: featured_employeesCreateOrConnectWithoutLinkedin_infoInput | featured_employeesCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: featured_employeesUpsertWithWhereUniqueWithoutLinkedin_infoInput | featured_employeesUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: featured_employeesCreateManyLinkedin_infoInputEnvelope
    set?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    disconnect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    delete?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    connect?: featured_employeesWhereUniqueInput | featured_employeesWhereUniqueInput[]
    update?: featured_employeesUpdateWithWhereUniqueWithoutLinkedin_infoInput | featured_employeesUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: featured_employeesUpdateManyWithWhereWithoutLinkedin_infoInput | featured_employeesUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: featured_employeesScalarWhereInput | featured_employeesScalarWhereInput[]
  }

  export type locationsUncheckedUpdateManyWithoutLinkedin_infoNestedInput = {
    create?: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput> | locationsCreateWithoutLinkedin_infoInput[] | locationsUncheckedCreateWithoutLinkedin_infoInput[]
    connectOrCreate?: locationsCreateOrConnectWithoutLinkedin_infoInput | locationsCreateOrConnectWithoutLinkedin_infoInput[]
    upsert?: locationsUpsertWithWhereUniqueWithoutLinkedin_infoInput | locationsUpsertWithWhereUniqueWithoutLinkedin_infoInput[]
    createMany?: locationsCreateManyLinkedin_infoInputEnvelope
    set?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    disconnect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    delete?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    connect?: locationsWhereUniqueInput | locationsWhereUniqueInput[]
    update?: locationsUpdateWithWhereUniqueWithoutLinkedin_infoInput | locationsUpdateWithWhereUniqueWithoutLinkedin_infoInput[]
    updateMany?: locationsUpdateManyWithWhereWithoutLinkedin_infoInput | locationsUpdateManyWithWhereWithoutLinkedin_infoInput[]
    deleteMany?: locationsScalarWhereInput | locationsScalarWhereInput[]
  }

  export type linkedin_infoCreateNestedOneWithoutCompany_specialties_collectionInput = {
    create?: XOR<linkedin_infoCreateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_specialties_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutCompany_specialties_collectionInput
    connect?: linkedin_infoWhereUniqueInput
  }

  export type linkedin_infoUpdateOneRequiredWithoutCompany_specialties_collectionNestedInput = {
    create?: XOR<linkedin_infoCreateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_specialties_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutCompany_specialties_collectionInput
    upsert?: linkedin_infoUpsertWithoutCompany_specialties_collectionInput
    connect?: linkedin_infoWhereUniqueInput
    update?: XOR<XOR<linkedin_infoUpdateToOneWithWhereWithoutCompany_specialties_collectionInput, linkedin_infoUpdateWithoutCompany_specialties_collectionInput>, linkedin_infoUncheckedUpdateWithoutCompany_specialties_collectionInput>
  }

  export type linkedin_infoCreateNestedOneWithoutCompany_featured_employees_collectionInput = {
    create?: XOR<linkedin_infoCreateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_featured_employees_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutCompany_featured_employees_collectionInput
    connect?: linkedin_infoWhereUniqueInput
  }

  export type linkedin_infoUpdateOneRequiredWithoutCompany_featured_employees_collectionNestedInput = {
    create?: XOR<linkedin_infoCreateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_featured_employees_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutCompany_featured_employees_collectionInput
    upsert?: linkedin_infoUpsertWithoutCompany_featured_employees_collectionInput
    connect?: linkedin_infoWhereUniqueInput
    update?: XOR<XOR<linkedin_infoUpdateToOneWithWhereWithoutCompany_featured_employees_collectionInput, linkedin_infoUpdateWithoutCompany_featured_employees_collectionInput>, linkedin_infoUncheckedUpdateWithoutCompany_featured_employees_collectionInput>
  }

  export type linkedin_infoCreateNestedOneWithoutLocations_collectionInput = {
    create?: XOR<linkedin_infoCreateWithoutLocations_collectionInput, linkedin_infoUncheckedCreateWithoutLocations_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutLocations_collectionInput
    connect?: linkedin_infoWhereUniqueInput
  }

  export type linkedin_infoUpdateOneRequiredWithoutLocations_collectionNestedInput = {
    create?: XOR<linkedin_infoCreateWithoutLocations_collectionInput, linkedin_infoUncheckedCreateWithoutLocations_collectionInput>
    connectOrCreate?: linkedin_infoCreateOrConnectWithoutLocations_collectionInput
    upsert?: linkedin_infoUpsertWithoutLocations_collectionInput
    connect?: linkedin_infoWhereUniqueInput
    update?: XOR<XOR<linkedin_infoUpdateToOneWithWhereWithoutLocations_collectionInput, linkedin_infoUpdateWithoutLocations_collectionInput>, linkedin_infoUncheckedUpdateWithoutLocations_collectionInput>
  }

  export type vendor_companiesCreateNestedOneWithoutFunding_infoInput = {
    create?: XOR<vendor_companiesCreateWithoutFunding_infoInput, vendor_companiesUncheckedCreateWithoutFunding_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutFunding_infoInput
    connect?: vendor_companiesWhereUniqueInput
  }

  export type categoriesCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput> | categoriesCreateWithoutFunding_infoInput[] | categoriesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: categoriesCreateOrConnectWithoutFunding_infoInput | categoriesCreateOrConnectWithoutFunding_infoInput[]
    createMany?: categoriesCreateManyFunding_infoInputEnvelope
    connect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
  }

  export type press_referencesCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput> | press_referencesCreateWithoutFunding_infoInput[] | press_referencesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: press_referencesCreateOrConnectWithoutFunding_infoInput | press_referencesCreateOrConnectWithoutFunding_infoInput[]
    createMany?: press_referencesCreateManyFunding_infoInputEnvelope
    connect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
  }

  export type funding_roundsCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput> | funding_roundsCreateWithoutFunding_infoInput[] | funding_roundsUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: funding_roundsCreateOrConnectWithoutFunding_infoInput | funding_roundsCreateOrConnectWithoutFunding_infoInput[]
    createMany?: funding_roundsCreateManyFunding_infoInputEnvelope
    connect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
  }

  export type foundersCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput> | foundersCreateWithoutFunding_infoInput[] | foundersUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: foundersCreateOrConnectWithoutFunding_infoInput | foundersCreateOrConnectWithoutFunding_infoInput[]
    createMany?: foundersCreateManyFunding_infoInputEnvelope
    connect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
  }

  export type categoriesUncheckedCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput> | categoriesCreateWithoutFunding_infoInput[] | categoriesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: categoriesCreateOrConnectWithoutFunding_infoInput | categoriesCreateOrConnectWithoutFunding_infoInput[]
    createMany?: categoriesCreateManyFunding_infoInputEnvelope
    connect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
  }

  export type press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput> | press_referencesCreateWithoutFunding_infoInput[] | press_referencesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: press_referencesCreateOrConnectWithoutFunding_infoInput | press_referencesCreateOrConnectWithoutFunding_infoInput[]
    createMany?: press_referencesCreateManyFunding_infoInputEnvelope
    connect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
  }

  export type funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput> | funding_roundsCreateWithoutFunding_infoInput[] | funding_roundsUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: funding_roundsCreateOrConnectWithoutFunding_infoInput | funding_roundsCreateOrConnectWithoutFunding_infoInput[]
    createMany?: funding_roundsCreateManyFunding_infoInputEnvelope
    connect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
  }

  export type foundersUncheckedCreateNestedManyWithoutFunding_infoInput = {
    create?: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput> | foundersCreateWithoutFunding_infoInput[] | foundersUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: foundersCreateOrConnectWithoutFunding_infoInput | foundersCreateOrConnectWithoutFunding_infoInput[]
    createMany?: foundersCreateManyFunding_infoInputEnvelope
    connect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
  }

  export type vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput = {
    create?: XOR<vendor_companiesCreateWithoutFunding_infoInput, vendor_companiesUncheckedCreateWithoutFunding_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutFunding_infoInput
    upsert?: vendor_companiesUpsertWithoutFunding_infoInput
    connect?: vendor_companiesWhereUniqueInput
    update?: XOR<XOR<vendor_companiesUpdateToOneWithWhereWithoutFunding_infoInput, vendor_companiesUpdateWithoutFunding_infoInput>, vendor_companiesUncheckedUpdateWithoutFunding_infoInput>
  }

  export type categoriesUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput> | categoriesCreateWithoutFunding_infoInput[] | categoriesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: categoriesCreateOrConnectWithoutFunding_infoInput | categoriesCreateOrConnectWithoutFunding_infoInput[]
    upsert?: categoriesUpsertWithWhereUniqueWithoutFunding_infoInput | categoriesUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: categoriesCreateManyFunding_infoInputEnvelope
    set?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    disconnect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    delete?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    connect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    update?: categoriesUpdateWithWhereUniqueWithoutFunding_infoInput | categoriesUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: categoriesUpdateManyWithWhereWithoutFunding_infoInput | categoriesUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: categoriesScalarWhereInput | categoriesScalarWhereInput[]
  }

  export type press_referencesUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput> | press_referencesCreateWithoutFunding_infoInput[] | press_referencesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: press_referencesCreateOrConnectWithoutFunding_infoInput | press_referencesCreateOrConnectWithoutFunding_infoInput[]
    upsert?: press_referencesUpsertWithWhereUniqueWithoutFunding_infoInput | press_referencesUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: press_referencesCreateManyFunding_infoInputEnvelope
    set?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    disconnect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    delete?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    connect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    update?: press_referencesUpdateWithWhereUniqueWithoutFunding_infoInput | press_referencesUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: press_referencesUpdateManyWithWhereWithoutFunding_infoInput | press_referencesUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: press_referencesScalarWhereInput | press_referencesScalarWhereInput[]
  }

  export type funding_roundsUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput> | funding_roundsCreateWithoutFunding_infoInput[] | funding_roundsUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: funding_roundsCreateOrConnectWithoutFunding_infoInput | funding_roundsCreateOrConnectWithoutFunding_infoInput[]
    upsert?: funding_roundsUpsertWithWhereUniqueWithoutFunding_infoInput | funding_roundsUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: funding_roundsCreateManyFunding_infoInputEnvelope
    set?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    disconnect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    delete?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    connect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    update?: funding_roundsUpdateWithWhereUniqueWithoutFunding_infoInput | funding_roundsUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: funding_roundsUpdateManyWithWhereWithoutFunding_infoInput | funding_roundsUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: funding_roundsScalarWhereInput | funding_roundsScalarWhereInput[]
  }

  export type foundersUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput> | foundersCreateWithoutFunding_infoInput[] | foundersUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: foundersCreateOrConnectWithoutFunding_infoInput | foundersCreateOrConnectWithoutFunding_infoInput[]
    upsert?: foundersUpsertWithWhereUniqueWithoutFunding_infoInput | foundersUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: foundersCreateManyFunding_infoInputEnvelope
    set?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    disconnect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    delete?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    connect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    update?: foundersUpdateWithWhereUniqueWithoutFunding_infoInput | foundersUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: foundersUpdateManyWithWhereWithoutFunding_infoInput | foundersUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: foundersScalarWhereInput | foundersScalarWhereInput[]
  }

  export type categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput> | categoriesCreateWithoutFunding_infoInput[] | categoriesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: categoriesCreateOrConnectWithoutFunding_infoInput | categoriesCreateOrConnectWithoutFunding_infoInput[]
    upsert?: categoriesUpsertWithWhereUniqueWithoutFunding_infoInput | categoriesUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: categoriesCreateManyFunding_infoInputEnvelope
    set?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    disconnect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    delete?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    connect?: categoriesWhereUniqueInput | categoriesWhereUniqueInput[]
    update?: categoriesUpdateWithWhereUniqueWithoutFunding_infoInput | categoriesUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: categoriesUpdateManyWithWhereWithoutFunding_infoInput | categoriesUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: categoriesScalarWhereInput | categoriesScalarWhereInput[]
  }

  export type press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput> | press_referencesCreateWithoutFunding_infoInput[] | press_referencesUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: press_referencesCreateOrConnectWithoutFunding_infoInput | press_referencesCreateOrConnectWithoutFunding_infoInput[]
    upsert?: press_referencesUpsertWithWhereUniqueWithoutFunding_infoInput | press_referencesUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: press_referencesCreateManyFunding_infoInputEnvelope
    set?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    disconnect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    delete?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    connect?: press_referencesWhereUniqueInput | press_referencesWhereUniqueInput[]
    update?: press_referencesUpdateWithWhereUniqueWithoutFunding_infoInput | press_referencesUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: press_referencesUpdateManyWithWhereWithoutFunding_infoInput | press_referencesUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: press_referencesScalarWhereInput | press_referencesScalarWhereInput[]
  }

  export type funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput> | funding_roundsCreateWithoutFunding_infoInput[] | funding_roundsUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: funding_roundsCreateOrConnectWithoutFunding_infoInput | funding_roundsCreateOrConnectWithoutFunding_infoInput[]
    upsert?: funding_roundsUpsertWithWhereUniqueWithoutFunding_infoInput | funding_roundsUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: funding_roundsCreateManyFunding_infoInputEnvelope
    set?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    disconnect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    delete?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    connect?: funding_roundsWhereUniqueInput | funding_roundsWhereUniqueInput[]
    update?: funding_roundsUpdateWithWhereUniqueWithoutFunding_infoInput | funding_roundsUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: funding_roundsUpdateManyWithWhereWithoutFunding_infoInput | funding_roundsUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: funding_roundsScalarWhereInput | funding_roundsScalarWhereInput[]
  }

  export type foundersUncheckedUpdateManyWithoutFunding_infoNestedInput = {
    create?: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput> | foundersCreateWithoutFunding_infoInput[] | foundersUncheckedCreateWithoutFunding_infoInput[]
    connectOrCreate?: foundersCreateOrConnectWithoutFunding_infoInput | foundersCreateOrConnectWithoutFunding_infoInput[]
    upsert?: foundersUpsertWithWhereUniqueWithoutFunding_infoInput | foundersUpsertWithWhereUniqueWithoutFunding_infoInput[]
    createMany?: foundersCreateManyFunding_infoInputEnvelope
    set?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    disconnect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    delete?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    connect?: foundersWhereUniqueInput | foundersWhereUniqueInput[]
    update?: foundersUpdateWithWhereUniqueWithoutFunding_infoInput | foundersUpdateWithWhereUniqueWithoutFunding_infoInput[]
    updateMany?: foundersUpdateManyWithWhereWithoutFunding_infoInput | foundersUpdateManyWithWhereWithoutFunding_infoInput[]
    deleteMany?: foundersScalarWhereInput | foundersScalarWhereInput[]
  }

  export type funding_infoCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<funding_infoCreateWithoutCategoriesInput, funding_infoUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutCategoriesInput
    connect?: funding_infoWhereUniqueInput
  }

  export type funding_infoUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<funding_infoCreateWithoutCategoriesInput, funding_infoUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutCategoriesInput
    upsert?: funding_infoUpsertWithoutCategoriesInput
    connect?: funding_infoWhereUniqueInput
    update?: XOR<XOR<funding_infoUpdateToOneWithWhereWithoutCategoriesInput, funding_infoUpdateWithoutCategoriesInput>, funding_infoUncheckedUpdateWithoutCategoriesInput>
  }

  export type funding_infoCreateNestedOneWithoutPress_referencesInput = {
    create?: XOR<funding_infoCreateWithoutPress_referencesInput, funding_infoUncheckedCreateWithoutPress_referencesInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutPress_referencesInput
    connect?: funding_infoWhereUniqueInput
  }

  export type funding_infoUpdateOneRequiredWithoutPress_referencesNestedInput = {
    create?: XOR<funding_infoCreateWithoutPress_referencesInput, funding_infoUncheckedCreateWithoutPress_referencesInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutPress_referencesInput
    upsert?: funding_infoUpsertWithoutPress_referencesInput
    connect?: funding_infoWhereUniqueInput
    update?: XOR<XOR<funding_infoUpdateToOneWithWhereWithoutPress_referencesInput, funding_infoUpdateWithoutPress_referencesInput>, funding_infoUncheckedUpdateWithoutPress_referencesInput>
  }

  export type funding_infoCreateNestedOneWithoutRaised_funding_roundsInput = {
    create?: XOR<funding_infoCreateWithoutRaised_funding_roundsInput, funding_infoUncheckedCreateWithoutRaised_funding_roundsInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutRaised_funding_roundsInput
    connect?: funding_infoWhereUniqueInput
  }

  export type funding_infoUpdateOneRequiredWithoutRaised_funding_roundsNestedInput = {
    create?: XOR<funding_infoCreateWithoutRaised_funding_roundsInput, funding_infoUncheckedCreateWithoutRaised_funding_roundsInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutRaised_funding_roundsInput
    upsert?: funding_infoUpsertWithoutRaised_funding_roundsInput
    connect?: funding_infoWhereUniqueInput
    update?: XOR<XOR<funding_infoUpdateToOneWithWhereWithoutRaised_funding_roundsInput, funding_infoUpdateWithoutRaised_funding_roundsInput>, funding_infoUncheckedUpdateWithoutRaised_funding_roundsInput>
  }

  export type funding_infoCreateNestedOneWithoutFoundersInput = {
    create?: XOR<funding_infoCreateWithoutFoundersInput, funding_infoUncheckedCreateWithoutFoundersInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutFoundersInput
    connect?: funding_infoWhereUniqueInput
  }

  export type funding_infoUpdateOneRequiredWithoutFoundersNestedInput = {
    create?: XOR<funding_infoCreateWithoutFoundersInput, funding_infoUncheckedCreateWithoutFoundersInput>
    connectOrCreate?: funding_infoCreateOrConnectWithoutFoundersInput
    upsert?: funding_infoUpsertWithoutFoundersInput
    connect?: funding_infoWhereUniqueInput
    update?: XOR<XOR<funding_infoUpdateToOneWithWhereWithoutFoundersInput, funding_infoUpdateWithoutFoundersInput>, funding_infoUncheckedUpdateWithoutFoundersInput>
  }

  export type vendor_companiesCreateNestedOneWithoutWebsite_infoInput = {
    create?: XOR<vendor_companiesCreateWithoutWebsite_infoInput, vendor_companiesUncheckedCreateWithoutWebsite_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutWebsite_infoInput
    connect?: vendor_companiesWhereUniqueInput
  }

  export type vendor_companiesUpdateOneRequiredWithoutWebsite_infoNestedInput = {
    create?: XOR<vendor_companiesCreateWithoutWebsite_infoInput, vendor_companiesUncheckedCreateWithoutWebsite_infoInput>
    connectOrCreate?: vendor_companiesCreateOrConnectWithoutWebsite_infoInput
    upsert?: vendor_companiesUpsertWithoutWebsite_infoInput
    connect?: vendor_companiesWhereUniqueInput
    update?: XOR<XOR<vendor_companiesUpdateToOneWithWhereWithoutWebsite_infoInput, vendor_companiesUpdateWithoutWebsite_infoInput>, vendor_companiesUncheckedUpdateWithoutWebsite_infoInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type traffic_infoCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
  }

  export type traffic_infoUncheckedCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
  }

  export type traffic_infoCreateOrConnectWithoutVendor_companyInput = {
    where: traffic_infoWhereUniqueInput
    create: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type traffic_infoCreateManyVendor_companyInputEnvelope = {
    data: traffic_infoCreateManyVendor_companyInput | traffic_infoCreateManyVendor_companyInput[]
    skipDuplicates?: boolean
  }

  export type linkedin_infoCreateWithoutVendor_companyInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_specialties_collection?: company_specialtiesCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUncheckedCreateWithoutVendor_companyInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_specialties_collection?: company_specialtiesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsUncheckedCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoCreateOrConnectWithoutVendor_companyInput = {
    where: linkedin_infoWhereUniqueInput
    create: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type linkedin_infoCreateManyVendor_companyInputEnvelope = {
    data: linkedin_infoCreateManyVendor_companyInput | linkedin_infoCreateManyVendor_companyInput[]
    skipDuplicates?: boolean
  }

  export type funding_infoCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsCreateNestedManyWithoutFunding_infoInput
    founders?: foundersCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesUncheckedCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput
    founders?: foundersUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoCreateOrConnectWithoutVendor_companyInput = {
    where: funding_infoWhereUniqueInput
    create: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type funding_infoCreateManyVendor_companyInputEnvelope = {
    data: funding_infoCreateManyVendor_companyInput | funding_infoCreateManyVendor_companyInput[]
    skipDuplicates?: boolean
  }

  export type website_infoCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
  }

  export type website_infoUncheckedCreateWithoutVendor_companyInput = {
    id?: string
    last_updated?: Date | string
  }

  export type website_infoCreateOrConnectWithoutVendor_companyInput = {
    where: website_infoWhereUniqueInput
    create: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type website_infoCreateManyVendor_companyInputEnvelope = {
    data: website_infoCreateManyVendor_companyInput | website_infoCreateManyVendor_companyInput[]
    skipDuplicates?: boolean
  }

  export type traffic_infoUpsertWithWhereUniqueWithoutVendor_companyInput = {
    where: traffic_infoWhereUniqueInput
    update: XOR<traffic_infoUpdateWithoutVendor_companyInput, traffic_infoUncheckedUpdateWithoutVendor_companyInput>
    create: XOR<traffic_infoCreateWithoutVendor_companyInput, traffic_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type traffic_infoUpdateWithWhereUniqueWithoutVendor_companyInput = {
    where: traffic_infoWhereUniqueInput
    data: XOR<traffic_infoUpdateWithoutVendor_companyInput, traffic_infoUncheckedUpdateWithoutVendor_companyInput>
  }

  export type traffic_infoUpdateManyWithWhereWithoutVendor_companyInput = {
    where: traffic_infoScalarWhereInput
    data: XOR<traffic_infoUpdateManyMutationInput, traffic_infoUncheckedUpdateManyWithoutVendor_companyInput>
  }

  export type traffic_infoScalarWhereInput = {
    AND?: traffic_infoScalarWhereInput | traffic_infoScalarWhereInput[]
    OR?: traffic_infoScalarWhereInput[]
    NOT?: traffic_infoScalarWhereInput | traffic_infoScalarWhereInput[]
    id?: UuidFilter<"traffic_info"> | string
    company_id?: UuidFilter<"traffic_info"> | string
    last_updated?: DateTimeFilter<"traffic_info"> | Date | string
    display_date?: DateTimeFilter<"traffic_info"> | Date | string
    rank?: IntFilter<"traffic_info"> | number
    visits?: IntFilter<"traffic_info"> | number
    users?: IntFilter<"traffic_info"> | number
    search_organic?: IntFilter<"traffic_info"> | number
    search_paid?: IntFilter<"traffic_info"> | number
    social_organic?: IntFilter<"traffic_info"> | number
    social_paid?: IntFilter<"traffic_info"> | number
    referral?: IntFilter<"traffic_info"> | number
    time_on_site?: IntFilter<"traffic_info"> | number
    pages_per_visit?: FloatFilter<"traffic_info"> | number
    bounce_rate?: FloatFilter<"traffic_info"> | number
    categories?: StringFilter<"traffic_info"> | string
  }

  export type linkedin_infoUpsertWithWhereUniqueWithoutVendor_companyInput = {
    where: linkedin_infoWhereUniqueInput
    update: XOR<linkedin_infoUpdateWithoutVendor_companyInput, linkedin_infoUncheckedUpdateWithoutVendor_companyInput>
    create: XOR<linkedin_infoCreateWithoutVendor_companyInput, linkedin_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type linkedin_infoUpdateWithWhereUniqueWithoutVendor_companyInput = {
    where: linkedin_infoWhereUniqueInput
    data: XOR<linkedin_infoUpdateWithoutVendor_companyInput, linkedin_infoUncheckedUpdateWithoutVendor_companyInput>
  }

  export type linkedin_infoUpdateManyWithWhereWithoutVendor_companyInput = {
    where: linkedin_infoScalarWhereInput
    data: XOR<linkedin_infoUpdateManyMutationInput, linkedin_infoUncheckedUpdateManyWithoutVendor_companyInput>
  }

  export type linkedin_infoScalarWhereInput = {
    AND?: linkedin_infoScalarWhereInput | linkedin_infoScalarWhereInput[]
    OR?: linkedin_infoScalarWhereInput[]
    NOT?: linkedin_infoScalarWhereInput | linkedin_infoScalarWhereInput[]
    id?: StringFilter<"linkedin_info"> | string
    company_id?: UuidFilter<"linkedin_info"> | string
    last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    company_size?: StringFilter<"linkedin_info"> | string
    industry?: StringFilter<"linkedin_info"> | string
    description?: StringFilter<"linkedin_info"> | string
    linkedin_followers?: IntFilter<"linkedin_info"> | number
    founded?: IntFilter<"linkedin_info"> | number
    created?: DateTimeFilter<"linkedin_info"> | Date | string
    li_last_updated?: DateTimeFilter<"linkedin_info"> | Date | string
    type?: StringFilter<"linkedin_info"> | string
    employees_count?: IntFilter<"linkedin_info"> | number
  }

  export type funding_infoUpsertWithWhereUniqueWithoutVendor_companyInput = {
    where: funding_infoWhereUniqueInput
    update: XOR<funding_infoUpdateWithoutVendor_companyInput, funding_infoUncheckedUpdateWithoutVendor_companyInput>
    create: XOR<funding_infoCreateWithoutVendor_companyInput, funding_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type funding_infoUpdateWithWhereUniqueWithoutVendor_companyInput = {
    where: funding_infoWhereUniqueInput
    data: XOR<funding_infoUpdateWithoutVendor_companyInput, funding_infoUncheckedUpdateWithoutVendor_companyInput>
  }

  export type funding_infoUpdateManyWithWhereWithoutVendor_companyInput = {
    where: funding_infoScalarWhereInput
    data: XOR<funding_infoUpdateManyMutationInput, funding_infoUncheckedUpdateManyWithoutVendor_companyInput>
  }

  export type funding_infoScalarWhereInput = {
    AND?: funding_infoScalarWhereInput | funding_infoScalarWhereInput[]
    OR?: funding_infoScalarWhereInput[]
    NOT?: funding_infoScalarWhereInput | funding_infoScalarWhereInput[]
    id?: UuidFilter<"funding_info"> | string
    company_id?: UuidFilter<"funding_info"> | string
    last_updated?: DateTimeFilter<"funding_info"> | Date | string
    company_img_url?: StringFilter<"funding_info"> | string
    company_type?: StringFilter<"funding_info"> | string
    ipo_status?: StringFilter<"funding_info"> | string
    revenue_range?: StringFilter<"funding_info"> | string
    org_rank?: IntFilter<"funding_info"> | number
    num_articles?: IntFilter<"funding_info"> | number
  }

  export type website_infoUpsertWithWhereUniqueWithoutVendor_companyInput = {
    where: website_infoWhereUniqueInput
    update: XOR<website_infoUpdateWithoutVendor_companyInput, website_infoUncheckedUpdateWithoutVendor_companyInput>
    create: XOR<website_infoCreateWithoutVendor_companyInput, website_infoUncheckedCreateWithoutVendor_companyInput>
  }

  export type website_infoUpdateWithWhereUniqueWithoutVendor_companyInput = {
    where: website_infoWhereUniqueInput
    data: XOR<website_infoUpdateWithoutVendor_companyInput, website_infoUncheckedUpdateWithoutVendor_companyInput>
  }

  export type website_infoUpdateManyWithWhereWithoutVendor_companyInput = {
    where: website_infoScalarWhereInput
    data: XOR<website_infoUpdateManyMutationInput, website_infoUncheckedUpdateManyWithoutVendor_companyInput>
  }

  export type website_infoScalarWhereInput = {
    AND?: website_infoScalarWhereInput | website_infoScalarWhereInput[]
    OR?: website_infoScalarWhereInput[]
    NOT?: website_infoScalarWhereInput | website_infoScalarWhereInput[]
    id?: UuidFilter<"website_info"> | string
    company_id?: UuidFilter<"website_info"> | string
    last_updated?: DateTimeFilter<"website_info"> | Date | string
  }

  export type vendor_companiesCreateWithoutTraffic_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    linkedin_info?: linkedin_infoCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUncheckedCreateWithoutTraffic_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    linkedin_info?: linkedin_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoUncheckedCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesCreateOrConnectWithoutTraffic_infoInput = {
    where: vendor_companiesWhereUniqueInput
    create: XOR<vendor_companiesCreateWithoutTraffic_infoInput, vendor_companiesUncheckedCreateWithoutTraffic_infoInput>
  }

  export type vendor_companiesUpsertWithoutTraffic_infoInput = {
    update: XOR<vendor_companiesUpdateWithoutTraffic_infoInput, vendor_companiesUncheckedUpdateWithoutTraffic_infoInput>
    create: XOR<vendor_companiesCreateWithoutTraffic_infoInput, vendor_companiesUncheckedCreateWithoutTraffic_infoInput>
    where?: vendor_companiesWhereInput
  }

  export type vendor_companiesUpdateToOneWithWhereWithoutTraffic_infoInput = {
    where?: vendor_companiesWhereInput
    data: XOR<vendor_companiesUpdateWithoutTraffic_infoInput, vendor_companiesUncheckedUpdateWithoutTraffic_infoInput>
  }

  export type vendor_companiesUpdateWithoutTraffic_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    linkedin_info?: linkedin_infoUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesUncheckedUpdateWithoutTraffic_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    linkedin_info?: linkedin_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesCreateWithoutLinkedin_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUncheckedCreateWithoutLinkedin_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoUncheckedCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesCreateOrConnectWithoutLinkedin_infoInput = {
    where: vendor_companiesWhereUniqueInput
    create: XOR<vendor_companiesCreateWithoutLinkedin_infoInput, vendor_companiesUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type company_specialtiesCreateWithoutLinkedin_infoInput = {
    id: string
    specialty: string
  }

  export type company_specialtiesUncheckedCreateWithoutLinkedin_infoInput = {
    id: string
    specialty: string
  }

  export type company_specialtiesCreateOrConnectWithoutLinkedin_infoInput = {
    where: company_specialtiesWhereUniqueInput
    create: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type company_specialtiesCreateManyLinkedin_infoInputEnvelope = {
    data: company_specialtiesCreateManyLinkedin_infoInput | company_specialtiesCreateManyLinkedin_infoInput[]
    skipDuplicates?: boolean
  }

  export type featured_employeesCreateWithoutLinkedin_infoInput = {
    id: string
    linkedin_url: string
  }

  export type featured_employeesUncheckedCreateWithoutLinkedin_infoInput = {
    id: string
    linkedin_url: string
  }

  export type featured_employeesCreateOrConnectWithoutLinkedin_infoInput = {
    where: featured_employeesWhereUniqueInput
    create: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type featured_employeesCreateManyLinkedin_infoInputEnvelope = {
    data: featured_employeesCreateManyLinkedin_infoInput | featured_employeesCreateManyLinkedin_infoInput[]
    skipDuplicates?: boolean
  }

  export type locationsCreateWithoutLinkedin_infoInput = {
    id: string
    location_address: string
  }

  export type locationsUncheckedCreateWithoutLinkedin_infoInput = {
    id: string
    location_address: string
  }

  export type locationsCreateOrConnectWithoutLinkedin_infoInput = {
    where: locationsWhereUniqueInput
    create: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type locationsCreateManyLinkedin_infoInputEnvelope = {
    data: locationsCreateManyLinkedin_infoInput | locationsCreateManyLinkedin_infoInput[]
    skipDuplicates?: boolean
  }

  export type vendor_companiesUpsertWithoutLinkedin_infoInput = {
    update: XOR<vendor_companiesUpdateWithoutLinkedin_infoInput, vendor_companiesUncheckedUpdateWithoutLinkedin_infoInput>
    create: XOR<vendor_companiesCreateWithoutLinkedin_infoInput, vendor_companiesUncheckedCreateWithoutLinkedin_infoInput>
    where?: vendor_companiesWhereInput
  }

  export type vendor_companiesUpdateToOneWithWhereWithoutLinkedin_infoInput = {
    where?: vendor_companiesWhereInput
    data: XOR<vendor_companiesUpdateWithoutLinkedin_infoInput, vendor_companiesUncheckedUpdateWithoutLinkedin_infoInput>
  }

  export type vendor_companiesUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesUncheckedUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
  }

  export type company_specialtiesUpsertWithWhereUniqueWithoutLinkedin_infoInput = {
    where: company_specialtiesWhereUniqueInput
    update: XOR<company_specialtiesUpdateWithoutLinkedin_infoInput, company_specialtiesUncheckedUpdateWithoutLinkedin_infoInput>
    create: XOR<company_specialtiesCreateWithoutLinkedin_infoInput, company_specialtiesUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type company_specialtiesUpdateWithWhereUniqueWithoutLinkedin_infoInput = {
    where: company_specialtiesWhereUniqueInput
    data: XOR<company_specialtiesUpdateWithoutLinkedin_infoInput, company_specialtiesUncheckedUpdateWithoutLinkedin_infoInput>
  }

  export type company_specialtiesUpdateManyWithWhereWithoutLinkedin_infoInput = {
    where: company_specialtiesScalarWhereInput
    data: XOR<company_specialtiesUpdateManyMutationInput, company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoInput>
  }

  export type company_specialtiesScalarWhereInput = {
    AND?: company_specialtiesScalarWhereInput | company_specialtiesScalarWhereInput[]
    OR?: company_specialtiesScalarWhereInput[]
    NOT?: company_specialtiesScalarWhereInput | company_specialtiesScalarWhereInput[]
    id?: StringFilter<"company_specialties"> | string
    linkedin_info_id?: StringFilter<"company_specialties"> | string
    specialty?: StringFilter<"company_specialties"> | string
  }

  export type featured_employeesUpsertWithWhereUniqueWithoutLinkedin_infoInput = {
    where: featured_employeesWhereUniqueInput
    update: XOR<featured_employeesUpdateWithoutLinkedin_infoInput, featured_employeesUncheckedUpdateWithoutLinkedin_infoInput>
    create: XOR<featured_employeesCreateWithoutLinkedin_infoInput, featured_employeesUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type featured_employeesUpdateWithWhereUniqueWithoutLinkedin_infoInput = {
    where: featured_employeesWhereUniqueInput
    data: XOR<featured_employeesUpdateWithoutLinkedin_infoInput, featured_employeesUncheckedUpdateWithoutLinkedin_infoInput>
  }

  export type featured_employeesUpdateManyWithWhereWithoutLinkedin_infoInput = {
    where: featured_employeesScalarWhereInput
    data: XOR<featured_employeesUpdateManyMutationInput, featured_employeesUncheckedUpdateManyWithoutLinkedin_infoInput>
  }

  export type featured_employeesScalarWhereInput = {
    AND?: featured_employeesScalarWhereInput | featured_employeesScalarWhereInput[]
    OR?: featured_employeesScalarWhereInput[]
    NOT?: featured_employeesScalarWhereInput | featured_employeesScalarWhereInput[]
    id?: StringFilter<"featured_employees"> | string
    linkedin_info_id?: StringFilter<"featured_employees"> | string
    linkedin_url?: StringFilter<"featured_employees"> | string
  }

  export type locationsUpsertWithWhereUniqueWithoutLinkedin_infoInput = {
    where: locationsWhereUniqueInput
    update: XOR<locationsUpdateWithoutLinkedin_infoInput, locationsUncheckedUpdateWithoutLinkedin_infoInput>
    create: XOR<locationsCreateWithoutLinkedin_infoInput, locationsUncheckedCreateWithoutLinkedin_infoInput>
  }

  export type locationsUpdateWithWhereUniqueWithoutLinkedin_infoInput = {
    where: locationsWhereUniqueInput
    data: XOR<locationsUpdateWithoutLinkedin_infoInput, locationsUncheckedUpdateWithoutLinkedin_infoInput>
  }

  export type locationsUpdateManyWithWhereWithoutLinkedin_infoInput = {
    where: locationsScalarWhereInput
    data: XOR<locationsUpdateManyMutationInput, locationsUncheckedUpdateManyWithoutLinkedin_infoInput>
  }

  export type locationsScalarWhereInput = {
    AND?: locationsScalarWhereInput | locationsScalarWhereInput[]
    OR?: locationsScalarWhereInput[]
    NOT?: locationsScalarWhereInput | locationsScalarWhereInput[]
    id?: StringFilter<"locations"> | string
    linkedin_info_id?: StringFilter<"locations"> | string
    location_address?: StringFilter<"locations"> | string
  }

  export type linkedin_infoCreateWithoutCompany_specialties_collectionInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    vendor_company: vendor_companiesCreateNestedOneWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUncheckedCreateWithoutCompany_specialties_collectionInput = {
    id: string
    company_id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_featured_employees_collection?: featured_employeesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsUncheckedCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoCreateOrConnectWithoutCompany_specialties_collectionInput = {
    where: linkedin_infoWhereUniqueInput
    create: XOR<linkedin_infoCreateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_specialties_collectionInput>
  }

  export type linkedin_infoUpsertWithoutCompany_specialties_collectionInput = {
    update: XOR<linkedin_infoUpdateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedUpdateWithoutCompany_specialties_collectionInput>
    create: XOR<linkedin_infoCreateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_specialties_collectionInput>
    where?: linkedin_infoWhereInput
  }

  export type linkedin_infoUpdateToOneWithWhereWithoutCompany_specialties_collectionInput = {
    where?: linkedin_infoWhereInput
    data: XOR<linkedin_infoUpdateWithoutCompany_specialties_collectionInput, linkedin_infoUncheckedUpdateWithoutCompany_specialties_collectionInput>
  }

  export type linkedin_infoUpdateWithoutCompany_specialties_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateWithoutCompany_specialties_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_featured_employees_collection?: featured_employeesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUncheckedUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoCreateWithoutCompany_featured_employees_collectionInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    vendor_company: vendor_companiesCreateNestedOneWithoutLinkedin_infoInput
    company_specialties_collection?: company_specialtiesCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUncheckedCreateWithoutCompany_featured_employees_collectionInput = {
    id: string
    company_id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_specialties_collection?: company_specialtiesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    locations_collection?: locationsUncheckedCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoCreateOrConnectWithoutCompany_featured_employees_collectionInput = {
    where: linkedin_infoWhereUniqueInput
    create: XOR<linkedin_infoCreateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_featured_employees_collectionInput>
  }

  export type linkedin_infoUpsertWithoutCompany_featured_employees_collectionInput = {
    update: XOR<linkedin_infoUpdateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedUpdateWithoutCompany_featured_employees_collectionInput>
    create: XOR<linkedin_infoCreateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedCreateWithoutCompany_featured_employees_collectionInput>
    where?: linkedin_infoWhereInput
  }

  export type linkedin_infoUpdateToOneWithWhereWithoutCompany_featured_employees_collectionInput = {
    where?: linkedin_infoWhereInput
    data: XOR<linkedin_infoUpdateWithoutCompany_featured_employees_collectionInput, linkedin_infoUncheckedUpdateWithoutCompany_featured_employees_collectionInput>
  }

  export type linkedin_infoUpdateWithoutCompany_featured_employees_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutLinkedin_infoNestedInput
    company_specialties_collection?: company_specialtiesUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateWithoutCompany_featured_employees_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_specialties_collection?: company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUncheckedUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoCreateWithoutLocations_collectionInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    vendor_company: vendor_companiesCreateNestedOneWithoutLinkedin_infoInput
    company_specialties_collection?: company_specialtiesCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoUncheckedCreateWithoutLocations_collectionInput = {
    id: string
    company_id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
    company_specialties_collection?: company_specialtiesUncheckedCreateNestedManyWithoutLinkedin_infoInput
    company_featured_employees_collection?: featured_employeesUncheckedCreateNestedManyWithoutLinkedin_infoInput
  }

  export type linkedin_infoCreateOrConnectWithoutLocations_collectionInput = {
    where: linkedin_infoWhereUniqueInput
    create: XOR<linkedin_infoCreateWithoutLocations_collectionInput, linkedin_infoUncheckedCreateWithoutLocations_collectionInput>
  }

  export type linkedin_infoUpsertWithoutLocations_collectionInput = {
    update: XOR<linkedin_infoUpdateWithoutLocations_collectionInput, linkedin_infoUncheckedUpdateWithoutLocations_collectionInput>
    create: XOR<linkedin_infoCreateWithoutLocations_collectionInput, linkedin_infoUncheckedCreateWithoutLocations_collectionInput>
    where?: linkedin_infoWhereInput
  }

  export type linkedin_infoUpdateToOneWithWhereWithoutLocations_collectionInput = {
    where?: linkedin_infoWhereInput
    data: XOR<linkedin_infoUpdateWithoutLocations_collectionInput, linkedin_infoUncheckedUpdateWithoutLocations_collectionInput>
  }

  export type linkedin_infoUpdateWithoutLocations_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutLinkedin_infoNestedInput
    company_specialties_collection?: company_specialtiesUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateWithoutLocations_collectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_specialties_collection?: company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type vendor_companiesCreateWithoutFunding_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUncheckedCreateWithoutFunding_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    website_info?: website_infoUncheckedCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesCreateOrConnectWithoutFunding_infoInput = {
    where: vendor_companiesWhereUniqueInput
    create: XOR<vendor_companiesCreateWithoutFunding_infoInput, vendor_companiesUncheckedCreateWithoutFunding_infoInput>
  }

  export type categoriesCreateWithoutFunding_infoInput = {
    id?: string
    category: string
  }

  export type categoriesUncheckedCreateWithoutFunding_infoInput = {
    id?: string
    category: string
  }

  export type categoriesCreateOrConnectWithoutFunding_infoInput = {
    where: categoriesWhereUniqueInput
    create: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput>
  }

  export type categoriesCreateManyFunding_infoInputEnvelope = {
    data: categoriesCreateManyFunding_infoInput | categoriesCreateManyFunding_infoInput[]
    skipDuplicates?: boolean
  }

  export type press_referencesCreateWithoutFunding_infoInput = {
    id?: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
  }

  export type press_referencesUncheckedCreateWithoutFunding_infoInput = {
    id?: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
  }

  export type press_referencesCreateOrConnectWithoutFunding_infoInput = {
    where: press_referencesWhereUniqueInput
    create: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput>
  }

  export type press_referencesCreateManyFunding_infoInputEnvelope = {
    data: press_referencesCreateManyFunding_infoInput | press_referencesCreateManyFunding_infoInput[]
    skipDuplicates?: boolean
  }

  export type funding_roundsCreateWithoutFunding_infoInput = {
    id?: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
  }

  export type funding_roundsUncheckedCreateWithoutFunding_infoInput = {
    id?: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
  }

  export type funding_roundsCreateOrConnectWithoutFunding_infoInput = {
    where: funding_roundsWhereUniqueInput
    create: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput>
  }

  export type funding_roundsCreateManyFunding_infoInputEnvelope = {
    data: funding_roundsCreateManyFunding_infoInput | funding_roundsCreateManyFunding_infoInput[]
    skipDuplicates?: boolean
  }

  export type foundersCreateWithoutFunding_infoInput = {
    id?: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
  }

  export type foundersUncheckedCreateWithoutFunding_infoInput = {
    id?: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
  }

  export type foundersCreateOrConnectWithoutFunding_infoInput = {
    where: foundersWhereUniqueInput
    create: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput>
  }

  export type foundersCreateManyFunding_infoInputEnvelope = {
    data: foundersCreateManyFunding_infoInput | foundersCreateManyFunding_infoInput[]
    skipDuplicates?: boolean
  }

  export type vendor_companiesUpsertWithoutFunding_infoInput = {
    update: XOR<vendor_companiesUpdateWithoutFunding_infoInput, vendor_companiesUncheckedUpdateWithoutFunding_infoInput>
    create: XOR<vendor_companiesCreateWithoutFunding_infoInput, vendor_companiesUncheckedCreateWithoutFunding_infoInput>
    where?: vendor_companiesWhereInput
  }

  export type vendor_companiesUpdateToOneWithWhereWithoutFunding_infoInput = {
    where?: vendor_companiesWhereInput
    data: XOR<vendor_companiesUpdateWithoutFunding_infoInput, vendor_companiesUncheckedUpdateWithoutFunding_infoInput>
  }

  export type vendor_companiesUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesUncheckedUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    website_info?: website_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
  }

  export type categoriesUpsertWithWhereUniqueWithoutFunding_infoInput = {
    where: categoriesWhereUniqueInput
    update: XOR<categoriesUpdateWithoutFunding_infoInput, categoriesUncheckedUpdateWithoutFunding_infoInput>
    create: XOR<categoriesCreateWithoutFunding_infoInput, categoriesUncheckedCreateWithoutFunding_infoInput>
  }

  export type categoriesUpdateWithWhereUniqueWithoutFunding_infoInput = {
    where: categoriesWhereUniqueInput
    data: XOR<categoriesUpdateWithoutFunding_infoInput, categoriesUncheckedUpdateWithoutFunding_infoInput>
  }

  export type categoriesUpdateManyWithWhereWithoutFunding_infoInput = {
    where: categoriesScalarWhereInput
    data: XOR<categoriesUpdateManyMutationInput, categoriesUncheckedUpdateManyWithoutFunding_infoInput>
  }

  export type categoriesScalarWhereInput = {
    AND?: categoriesScalarWhereInput | categoriesScalarWhereInput[]
    OR?: categoriesScalarWhereInput[]
    NOT?: categoriesScalarWhereInput | categoriesScalarWhereInput[]
    id?: StringFilter<"categories"> | string
    funding_info_id?: UuidFilter<"categories"> | string
    category?: StringFilter<"categories"> | string
  }

  export type press_referencesUpsertWithWhereUniqueWithoutFunding_infoInput = {
    where: press_referencesWhereUniqueInput
    update: XOR<press_referencesUpdateWithoutFunding_infoInput, press_referencesUncheckedUpdateWithoutFunding_infoInput>
    create: XOR<press_referencesCreateWithoutFunding_infoInput, press_referencesUncheckedCreateWithoutFunding_infoInput>
  }

  export type press_referencesUpdateWithWhereUniqueWithoutFunding_infoInput = {
    where: press_referencesWhereUniqueInput
    data: XOR<press_referencesUpdateWithoutFunding_infoInput, press_referencesUncheckedUpdateWithoutFunding_infoInput>
  }

  export type press_referencesUpdateManyWithWhereWithoutFunding_infoInput = {
    where: press_referencesScalarWhereInput
    data: XOR<press_referencesUpdateManyMutationInput, press_referencesUncheckedUpdateManyWithoutFunding_infoInput>
  }

  export type press_referencesScalarWhereInput = {
    AND?: press_referencesScalarWhereInput | press_referencesScalarWhereInput[]
    OR?: press_referencesScalarWhereInput[]
    NOT?: press_referencesScalarWhereInput | press_referencesScalarWhereInput[]
    id?: StringFilter<"press_references"> | string
    funding_info_id?: UuidFilter<"press_references"> | string
    author?: StringFilter<"press_references"> | string
    title?: StringFilter<"press_references"> | string
    publisher?: StringFilter<"press_references"> | string
    url?: StringFilter<"press_references"> | string
    posted_on?: DateTimeFilter<"press_references"> | Date | string
  }

  export type funding_roundsUpsertWithWhereUniqueWithoutFunding_infoInput = {
    where: funding_roundsWhereUniqueInput
    update: XOR<funding_roundsUpdateWithoutFunding_infoInput, funding_roundsUncheckedUpdateWithoutFunding_infoInput>
    create: XOR<funding_roundsCreateWithoutFunding_infoInput, funding_roundsUncheckedCreateWithoutFunding_infoInput>
  }

  export type funding_roundsUpdateWithWhereUniqueWithoutFunding_infoInput = {
    where: funding_roundsWhereUniqueInput
    data: XOR<funding_roundsUpdateWithoutFunding_infoInput, funding_roundsUncheckedUpdateWithoutFunding_infoInput>
  }

  export type funding_roundsUpdateManyWithWhereWithoutFunding_infoInput = {
    where: funding_roundsScalarWhereInput
    data: XOR<funding_roundsUpdateManyMutationInput, funding_roundsUncheckedUpdateManyWithoutFunding_infoInput>
  }

  export type funding_roundsScalarWhereInput = {
    AND?: funding_roundsScalarWhereInput | funding_roundsScalarWhereInput[]
    OR?: funding_roundsScalarWhereInput[]
    NOT?: funding_roundsScalarWhereInput | funding_roundsScalarWhereInput[]
    id?: StringFilter<"funding_rounds"> | string
    funding_info_id?: UuidFilter<"funding_rounds"> | string
    is_equity?: BoolFilter<"funding_rounds"> | boolean
    investment_stage?: StringFilter<"funding_rounds"> | string
    short_description?: StringFilter<"funding_rounds"> | string
    currency?: StringFilter<"funding_rounds"> | string
    money_raised?: IntFilter<"funding_rounds"> | number
    announced_on?: DateTimeFilter<"funding_rounds"> | Date | string
  }

  export type foundersUpsertWithWhereUniqueWithoutFunding_infoInput = {
    where: foundersWhereUniqueInput
    update: XOR<foundersUpdateWithoutFunding_infoInput, foundersUncheckedUpdateWithoutFunding_infoInput>
    create: XOR<foundersCreateWithoutFunding_infoInput, foundersUncheckedCreateWithoutFunding_infoInput>
  }

  export type foundersUpdateWithWhereUniqueWithoutFunding_infoInput = {
    where: foundersWhereUniqueInput
    data: XOR<foundersUpdateWithoutFunding_infoInput, foundersUncheckedUpdateWithoutFunding_infoInput>
  }

  export type foundersUpdateManyWithWhereWithoutFunding_infoInput = {
    where: foundersScalarWhereInput
    data: XOR<foundersUpdateManyMutationInput, foundersUncheckedUpdateManyWithoutFunding_infoInput>
  }

  export type foundersScalarWhereInput = {
    AND?: foundersScalarWhereInput | foundersScalarWhereInput[]
    OR?: foundersScalarWhereInput[]
    NOT?: foundersScalarWhereInput | foundersScalarWhereInput[]
    id?: StringFilter<"founders"> | string
    funding_info_id?: UuidFilter<"founders"> | string
    full_name?: StringFilter<"founders"> | string
    primary_job_title?: StringFilter<"founders"> | string
    description?: StringFilter<"founders"> | string
    linkedin?: StringFilter<"founders"> | string
    num_founded_organizations?: IntFilter<"founders"> | number
    rank_person?: IntFilter<"founders"> | number
  }

  export type funding_infoCreateWithoutCategoriesInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    vendor_company: vendor_companiesCreateNestedOneWithoutFunding_infoInput
    press_references?: press_referencesCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsCreateNestedManyWithoutFunding_infoInput
    founders?: foundersCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateWithoutCategoriesInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    press_references?: press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput
    founders?: foundersUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoCreateOrConnectWithoutCategoriesInput = {
    where: funding_infoWhereUniqueInput
    create: XOR<funding_infoCreateWithoutCategoriesInput, funding_infoUncheckedCreateWithoutCategoriesInput>
  }

  export type funding_infoUpsertWithoutCategoriesInput = {
    update: XOR<funding_infoUpdateWithoutCategoriesInput, funding_infoUncheckedUpdateWithoutCategoriesInput>
    create: XOR<funding_infoCreateWithoutCategoriesInput, funding_infoUncheckedCreateWithoutCategoriesInput>
    where?: funding_infoWhereInput
  }

  export type funding_infoUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: funding_infoWhereInput
    data: XOR<funding_infoUpdateWithoutCategoriesInput, funding_infoUncheckedUpdateWithoutCategoriesInput>
  }

  export type funding_infoUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput
    press_references?: press_referencesUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    press_references?: press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoCreateWithoutPress_referencesInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    vendor_company: vendor_companiesCreateNestedOneWithoutFunding_infoInput
    categories?: categoriesCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsCreateNestedManyWithoutFunding_infoInput
    founders?: foundersCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateWithoutPress_referencesInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesUncheckedCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput
    founders?: foundersUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoCreateOrConnectWithoutPress_referencesInput = {
    where: funding_infoWhereUniqueInput
    create: XOR<funding_infoCreateWithoutPress_referencesInput, funding_infoUncheckedCreateWithoutPress_referencesInput>
  }

  export type funding_infoUpsertWithoutPress_referencesInput = {
    update: XOR<funding_infoUpdateWithoutPress_referencesInput, funding_infoUncheckedUpdateWithoutPress_referencesInput>
    create: XOR<funding_infoCreateWithoutPress_referencesInput, funding_infoUncheckedCreateWithoutPress_referencesInput>
    where?: funding_infoWhereInput
  }

  export type funding_infoUpdateToOneWithWhereWithoutPress_referencesInput = {
    where?: funding_infoWhereInput
    data: XOR<funding_infoUpdateWithoutPress_referencesInput, funding_infoUncheckedUpdateWithoutPress_referencesInput>
  }

  export type funding_infoUpdateWithoutPress_referencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput
    categories?: categoriesUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateWithoutPress_referencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoCreateWithoutRaised_funding_roundsInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    vendor_company: vendor_companiesCreateNestedOneWithoutFunding_infoInput
    categories?: categoriesCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesCreateNestedManyWithoutFunding_infoInput
    founders?: foundersCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateWithoutRaised_funding_roundsInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesUncheckedCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput
    founders?: foundersUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoCreateOrConnectWithoutRaised_funding_roundsInput = {
    where: funding_infoWhereUniqueInput
    create: XOR<funding_infoCreateWithoutRaised_funding_roundsInput, funding_infoUncheckedCreateWithoutRaised_funding_roundsInput>
  }

  export type funding_infoUpsertWithoutRaised_funding_roundsInput = {
    update: XOR<funding_infoUpdateWithoutRaised_funding_roundsInput, funding_infoUncheckedUpdateWithoutRaised_funding_roundsInput>
    create: XOR<funding_infoCreateWithoutRaised_funding_roundsInput, funding_infoUncheckedCreateWithoutRaised_funding_roundsInput>
    where?: funding_infoWhereInput
  }

  export type funding_infoUpdateToOneWithWhereWithoutRaised_funding_roundsInput = {
    where?: funding_infoWhereInput
    data: XOR<funding_infoUpdateWithoutRaised_funding_roundsInput, funding_infoUncheckedUpdateWithoutRaised_funding_roundsInput>
  }

  export type funding_infoUpdateWithoutRaised_funding_roundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput
    categories?: categoriesUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateWithoutRaised_funding_roundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoCreateWithoutFoundersInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    vendor_company: vendor_companiesCreateNestedOneWithoutFunding_infoInput
    categories?: categoriesCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoUncheckedCreateWithoutFoundersInput = {
    id?: string
    company_id: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
    categories?: categoriesUncheckedCreateNestedManyWithoutFunding_infoInput
    press_references?: press_referencesUncheckedCreateNestedManyWithoutFunding_infoInput
    raised_funding_rounds?: funding_roundsUncheckedCreateNestedManyWithoutFunding_infoInput
  }

  export type funding_infoCreateOrConnectWithoutFoundersInput = {
    where: funding_infoWhereUniqueInput
    create: XOR<funding_infoCreateWithoutFoundersInput, funding_infoUncheckedCreateWithoutFoundersInput>
  }

  export type funding_infoUpsertWithoutFoundersInput = {
    update: XOR<funding_infoUpdateWithoutFoundersInput, funding_infoUncheckedUpdateWithoutFoundersInput>
    create: XOR<funding_infoCreateWithoutFoundersInput, funding_infoUncheckedCreateWithoutFoundersInput>
    where?: funding_infoWhereInput
  }

  export type funding_infoUpdateToOneWithWhereWithoutFoundersInput = {
    where?: funding_infoWhereInput
    data: XOR<funding_infoUpdateWithoutFoundersInput, funding_infoUncheckedUpdateWithoutFoundersInput>
  }

  export type funding_infoUpdateWithoutFoundersInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    vendor_company?: vendor_companiesUpdateOneRequiredWithoutFunding_infoNestedInput
    categories?: categoriesUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateWithoutFoundersInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type vendor_companiesCreateWithoutWebsite_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesUncheckedCreateWithoutWebsite_infoInput = {
    id?: string
    company_name: string
    website_url: string
    linkedin_url: string
    type: string
    is_active: boolean
    is_cromatic_vendor: boolean
    traffic_info?: traffic_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    linkedin_info?: linkedin_infoUncheckedCreateNestedManyWithoutVendor_companyInput
    funding_info?: funding_infoUncheckedCreateNestedManyWithoutVendor_companyInput
  }

  export type vendor_companiesCreateOrConnectWithoutWebsite_infoInput = {
    where: vendor_companiesWhereUniqueInput
    create: XOR<vendor_companiesCreateWithoutWebsite_infoInput, vendor_companiesUncheckedCreateWithoutWebsite_infoInput>
  }

  export type vendor_companiesUpsertWithoutWebsite_infoInput = {
    update: XOR<vendor_companiesUpdateWithoutWebsite_infoInput, vendor_companiesUncheckedUpdateWithoutWebsite_infoInput>
    create: XOR<vendor_companiesCreateWithoutWebsite_infoInput, vendor_companiesUncheckedCreateWithoutWebsite_infoInput>
    where?: vendor_companiesWhereInput
  }

  export type vendor_companiesUpdateToOneWithWhereWithoutWebsite_infoInput = {
    where?: vendor_companiesWhereInput
    data: XOR<vendor_companiesUpdateWithoutWebsite_infoInput, vendor_companiesUncheckedUpdateWithoutWebsite_infoInput>
  }

  export type vendor_companiesUpdateWithoutWebsite_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUpdateManyWithoutVendor_companyNestedInput
  }

  export type vendor_companiesUncheckedUpdateWithoutWebsite_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_cromatic_vendor?: BoolFieldUpdateOperationsInput | boolean
    traffic_info?: traffic_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    linkedin_info?: linkedin_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
    funding_info?: funding_infoUncheckedUpdateManyWithoutVendor_companyNestedInput
  }

  export type traffic_infoCreateManyVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    display_date: Date | string
    rank: number
    visits: number
    users: number
    search_organic: number
    search_paid: number
    social_organic: number
    social_paid: number
    referral: number
    time_on_site: number
    pages_per_visit: number
    bounce_rate: number
    categories: string
  }

  export type linkedin_infoCreateManyVendor_companyInput = {
    id: string
    last_updated?: Date | string
    company_size: string
    industry: string
    description: string
    linkedin_followers: number
    founded: number
    created: Date | string
    li_last_updated: Date | string
    type: string
    employees_count: number
  }

  export type funding_infoCreateManyVendor_companyInput = {
    id?: string
    last_updated?: Date | string
    company_img_url: string
    company_type: string
    ipo_status: string
    revenue_range: string
    org_rank: number
    num_articles: number
  }

  export type website_infoCreateManyVendor_companyInput = {
    id?: string
    last_updated?: Date | string
  }

  export type traffic_infoUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type traffic_infoUncheckedUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type traffic_infoUncheckedUpdateManyWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    display_date?: DateTimeFieldUpdateOperationsInput | Date | string
    rank?: IntFieldUpdateOperationsInput | number
    visits?: IntFieldUpdateOperationsInput | number
    users?: IntFieldUpdateOperationsInput | number
    search_organic?: IntFieldUpdateOperationsInput | number
    search_paid?: IntFieldUpdateOperationsInput | number
    social_organic?: IntFieldUpdateOperationsInput | number
    social_paid?: IntFieldUpdateOperationsInput | number
    referral?: IntFieldUpdateOperationsInput | number
    time_on_site?: IntFieldUpdateOperationsInput | number
    pages_per_visit?: FloatFieldUpdateOperationsInput | number
    bounce_rate?: FloatFieldUpdateOperationsInput | number
    categories?: StringFieldUpdateOperationsInput | string
  }

  export type linkedin_infoUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_specialties_collection?: company_specialtiesUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
    company_specialties_collection?: company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    company_featured_employees_collection?: featured_employeesUncheckedUpdateManyWithoutLinkedin_infoNestedInput
    locations_collection?: locationsUncheckedUpdateManyWithoutLinkedin_infoNestedInput
  }

  export type linkedin_infoUncheckedUpdateManyWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_size?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin_followers?: IntFieldUpdateOperationsInput | number
    founded?: IntFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    li_last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    employees_count?: IntFieldUpdateOperationsInput | number
  }

  export type funding_infoUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
    categories?: categoriesUncheckedUpdateManyWithoutFunding_infoNestedInput
    press_references?: press_referencesUncheckedUpdateManyWithoutFunding_infoNestedInput
    raised_funding_rounds?: funding_roundsUncheckedUpdateManyWithoutFunding_infoNestedInput
    founders?: foundersUncheckedUpdateManyWithoutFunding_infoNestedInput
  }

  export type funding_infoUncheckedUpdateManyWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
    company_img_url?: StringFieldUpdateOperationsInput | string
    company_type?: StringFieldUpdateOperationsInput | string
    ipo_status?: StringFieldUpdateOperationsInput | string
    revenue_range?: StringFieldUpdateOperationsInput | string
    org_rank?: IntFieldUpdateOperationsInput | number
    num_articles?: IntFieldUpdateOperationsInput | number
  }

  export type website_infoUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type website_infoUncheckedUpdateWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type website_infoUncheckedUpdateManyWithoutVendor_companyInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_updated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type company_specialtiesCreateManyLinkedin_infoInput = {
    id: string
    specialty: string
  }

  export type featured_employeesCreateManyLinkedin_infoInput = {
    id: string
    linkedin_url: string
  }

  export type locationsCreateManyLinkedin_infoInput = {
    id: string
    location_address: string
  }

  export type company_specialtiesUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type company_specialtiesUncheckedUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type company_specialtiesUncheckedUpdateManyWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesUncheckedUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type featured_employeesUncheckedUpdateManyWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    linkedin_url?: StringFieldUpdateOperationsInput | string
  }

  export type locationsUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type locationsUncheckedUpdateWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type locationsUncheckedUpdateManyWithoutLinkedin_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    location_address?: StringFieldUpdateOperationsInput | string
  }

  export type categoriesCreateManyFunding_infoInput = {
    id?: string
    category: string
  }

  export type press_referencesCreateManyFunding_infoInput = {
    id?: string
    author: string
    title: string
    publisher: string
    url: string
    posted_on: Date | string
  }

  export type funding_roundsCreateManyFunding_infoInput = {
    id?: string
    is_equity: boolean
    investment_stage: string
    short_description: string
    currency: string
    money_raised: number
    announced_on: Date | string
  }

  export type foundersCreateManyFunding_infoInput = {
    id?: string
    full_name: string
    primary_job_title: string
    description: string
    linkedin: string
    num_founded_organizations: number
    rank_person: number
  }

  export type categoriesUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type categoriesUncheckedUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type categoriesUncheckedUpdateManyWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
  }

  export type press_referencesUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type press_referencesUncheckedUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type press_referencesUncheckedUpdateManyWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    publisher?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    posted_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsUncheckedUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type funding_roundsUncheckedUpdateManyWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    is_equity?: BoolFieldUpdateOperationsInput | boolean
    investment_stage?: StringFieldUpdateOperationsInput | string
    short_description?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    money_raised?: IntFieldUpdateOperationsInput | number
    announced_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type foundersUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }

  export type foundersUncheckedUpdateWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }

  export type foundersUncheckedUpdateManyWithoutFunding_infoInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    primary_job_title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    linkedin?: StringFieldUpdateOperationsInput | string
    num_founded_organizations?: IntFieldUpdateOperationsInput | number
    rank_person?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use vendor_companiesDefaultArgs instead
     */
    export type vendor_companiesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = vendor_companiesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use traffic_infoDefaultArgs instead
     */
    export type traffic_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = traffic_infoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use linkedin_infoDefaultArgs instead
     */
    export type linkedin_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = linkedin_infoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use company_specialtiesDefaultArgs instead
     */
    export type company_specialtiesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = company_specialtiesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use featured_employeesDefaultArgs instead
     */
    export type featured_employeesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = featured_employeesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use locationsDefaultArgs instead
     */
    export type locationsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = locationsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use funding_infoDefaultArgs instead
     */
    export type funding_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = funding_infoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use categoriesDefaultArgs instead
     */
    export type categoriesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = categoriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use press_referencesDefaultArgs instead
     */
    export type press_referencesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = press_referencesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use funding_roundsDefaultArgs instead
     */
    export type funding_roundsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = funding_roundsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use foundersDefaultArgs instead
     */
    export type foundersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = foundersDefaultArgs<ExtArgs>
    /**
     * @deprecated Use website_infoDefaultArgs instead
     */
    export type website_infoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = website_infoDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}