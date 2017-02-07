DECLARE @strSql nvarchar(MAX)

SET @strSql = N'
  SELECT
    @prmMonth AS [Ay],
    @prmYear AS [Yıl],
    @prmFormType AS [Form Tipi],
    @prmCurrency AS [Para Birimi],
    *
  FROM (
    SELECT
      DEFINITION_ AS [Ad],
      (
        CASE ISPERSCOMP
          WHEN 1 THEN TCKNO
          ELSE TAXNR
        END
      ) AS [Vergi No],
      SPECODE AS [Ozel Kod],
      INCHARGE AS [İlgili Kişi],
      EMAILADDR AS [E-Posta],
      TELCODES1 + '' '' + TELNRS1 AS [Telefon],
      FAXCODE + '' '' + FAXNR AS [Faks],
      CAST([Faturalar].[Adet] AS float) + CAST([Cari Fişleri].[Adet] AS float) AS Adet,
			CAST([Faturalar].[Tutar] AS float) + CAST([Cari Fişleri].[Tutar] AS float) AS Tutar
    FROM
      LG_' + @firmNr + '_CLCARD AS [Cariler]
      CROSS APPLY (
        SELECT
          COUNT(LOGICALREF) AS [Adet],
          ISNULL(SUM(GROSSTOTAL - TOTALDISCOUNTS), 0) AS [Tutar]
        FROM
          LG_' + @firmNr + '_' + @periodNr + '_INVOICE
        WHERE
          CANCELLED = 0 AND
          TRCODE IN (1, 2, 3, 4) AND
          CLIENTREF = Cariler.LOGICALREF AND
          MONTH(DATE_) = @prmMonth AND
          YEAR(DATE_) = @prmYear
      ) AS [Faturalar]
      CROSS APPLY (
        SELECT
          COUNT(LOGICALREF) AS [Adet],
          ISNULL(SUM(BRUTAMOUNT), 0) AS [Tutar]
        FROM
          LG_' + @firmNr + '_' + @periodNr + '_CLFLINE
        WHERE
          TRCODE = 46 AND
          CLIENTREF = [Cariler].LOGICALREF AND
          MONTH(DATE_) = @prmMonth AND
          YEAR(DATE_) = @prmYear
      ) AS [Cari Fişleri]
    WHERE
      [Cariler].ACTIVE = 0 AND
      [Faturalar].[Tutar] + [Cari Fişleri].[Tutar] >= @prmLimit
  ) AS t
  WHERE
    t.[Ad] <> '''' AND
    t.[Vergi No] <> ''''
  ORDER BY
    t.[Ad]
'

EXECUTE sp_executesql
  @strSql,
  N'
    @prmMonth int,
    @prmYear int,
    @prmLimit float,
    @prmFormType varchar(7),
    @prmCurrency varchar(3)
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmLimit = @limit,
  @prmFormType = 'Form BA',
  @prmCurrency = 'TRY'
