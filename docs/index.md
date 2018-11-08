# Skeletons

```javascript
const rule = new Skeletons()
```

## Constructor

```typescript
constructor(shema, options)
```

**arguments** :

|name|desciption|type|default|
|-|-|-|-|
|schema|set `rule.schema`|[Schema][define schema]|undefined|
|options.console|set `rule.default.console`: use console to log warning message.|Boolean|true|
|options.throw|set `rule.default.throw`: throw warning message|Boolean|true|
|options.dataName|set `rule.default.dataName`: data name that display in warning message.|String|'data'|
|options.schemaName|set `rule.default.schemaName`: schema name that display in warning message.|String|'schema'|

## Member

```javascript
rule: {}
```

**properties** :

|property|description|type|
|-|-|-|
|valid|After every validation this property will set to true or false to indicate validation status.|Boolean|
|warnings|After every validation warning information will store in `rule.warnings`|Array|
|default.console|default setting: use console to log warning message.|Boolean|
|default.throw|default setting: throw warning message|Boolean|
|default.dataName|default setting: data name that display in warning message.|String|
|default.schemaName|default setting: schema name that display in warning message.|String|

## Methods

### validate

```javascript
validate(data, options)
```

**arguments**:

|name|desciption|type|default|
|-|-|-|-|
|data|Target data to validate.|||
|options.console|Use console to log warning message.|Boolean|`rule.default.console`|
|options.throw|Throw warning message|Boolean| `rule.default.throw`|
|options.dataName|set `rule.default.dataName`: data name that display in warning message.|String|'data'|
|options.schemaName|set `rule.default.schemaName`: schema name that display in warning message.|String|'schema'|

## Static Function

See [Skeletons static function][static]

[define schema]:https://github.com/timtnleeProject/skeletons#define-schema
[static]:https://timtnleeproject.github.io/skeletons/static