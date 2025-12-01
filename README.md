Service translates time zones based on a city name.

# Communication Contract

### Requests

`GET /time`
- In query put one of the following:
    - `city`: Name of a valid timezone city
    - `offset`: Offset time from UTC written like so: `+5:30`

`GET /offset`
- In query put the following:
    - `city`: Name of a valid timezone city

### Responses

`GET /time`
- `400` No city or offset found, invalid format.
- `city`: 
    - `404` Invalid city name.
    - `200` Plain text response stating the current time, timezone, and locale
    string for that timezone.
- `offset`:
    - `400` Invalid offset format.
    - `200` Plain text response stating the UTC offset and the locale string
    for that offset.

`GET /offset`
- `400` No city found in request, invalid format.
- `404` Unknown timezone city.
- `200` JSON object in the following format:
```
{
    "offset": <timezone offset in minutes>
}
```
