SELECT
	p.*,
	f.*
FROM
	L_CAPIFIRM AS [Firmalar]
  CROSS APPLY (
    SELECT
      NR AS periodNr,
      BEGDATE AS begDate,
      ENDDATE AS endDate
    FROM
      L_CAPIPERIOD
    WHERE
      ACTIVE = 1 AND
      FIRMNR = [Firmalar].NR
  ) AS p
  CROSS APPLY
  (
    SELECT
      LOCALCTYP AS currencyNr,
      (
        CASE LOCALCTYP
          WHEN 1 THEN 'USD'
          WHEN 3 THEN 'AUD'
          WHEN 13 THEN 'JPY'
          WHEN 14 THEN 'CAD'
          WHEN 15 THEN 'KWD'
          WHEN 17 THEN 'GBP'
          WHEN 18 THEN 'SAR'
          WHEN 20 THEN 'EUR'
          WHEN 30 THEN 'IQD'
          WHEN 31 THEN 'IRR'
          ELSE 'TRY'
        END
      ) AS currency
    FROM
      L_CAPIFIRM
    WHERE
      NR = [Firmalar].NR
  ) AS f
WHERE
	[Firmalar].NR = @firmNr
