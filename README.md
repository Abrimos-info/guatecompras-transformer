# guatecompras-transformer

Transform data for Guatecompras public contracts.

## Install

```
git clone
npm install
```

## Run

```
(stream of JSON lines) | node guatecompras-transformer/index.js -t TRANSFORM | (stream of JSON lines)
```

## Parameters

```
--transform     -t      finalizado_anulado | finalizado_desierto | finalizado_adjudicado | terminado_adjudicado | publicados
```

## Data

Works with data downloaded from [the open data portal for Guatecompras](https://datos.minfin.gob.gt/dataset?q=Guatecompras&sort=score+desc%2C+metadata_modified+desc). Transform type should correspond with the data type described in the filename of each downloaded file. Data should be downloaded as CSV and then converted to JSON with column names as object property names.
