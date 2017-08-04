DECLARE @totView varchar(20)
DECLARE @totTable varchar(20)
DECLARE @strSql nvarchar(MAX)

SET @totView = 'LV_' + @firmNr + '_' + @periodNr + '_EMUHTOT'

IF OBJECT_ID(@totView) IS NULL
  SET @totTable = 'LG_' + @firmNr + '_' + @periodNr + '_EMUHTOT'
ELSE
  SET @totTable = @totView

SET @strSql = N'
  SELECT
    0 AS [Adet],
    @prmMonth AS [Ay],
    @prmYear AS [Yıl],
    @prmFormType AS [Form Tipi],
    @prmCurrency AS [Para Birimi],
    *
  FROM (
    SELECT
      CODE AS [Kod],
      DEFINITION_ AS [Ad],
      (
        CASE ISPERSCOMP
          WHEN 1 THEN TCKNO
          ELSE TAXNR
        END
      ) AS [Vergi No],
      SPECODE AS [Ozel Kod],
      INCHARGE AS [İlgili Kişi],
      REPLACE(EMAILADDR, '';'', '','') AS [E-Posta],
      LTRIM(TELCODES1 + '' '' + TELNRS1) AS [Telefon],
      LTRIM(FAXCODE + '' '' + FAXNR) AS [Faks],
      ISNULL(abs([Borç] - [Alacak]), 0) AS [Tutar],
      (
        CASE
          WHEN (ISNULL(ABS([Borç] - [Alacak]), 0) < 0.1) THEN ''''
          WHEN ([Borç] > [Alacak]) THEN ''Borçlu''
          WHEN ([Borç] < [Alacak]) THEN ''Alacaklı''
          ELSE ''''
        END
      ) AS [Borç/Alacak]
    FROM
      LG_' + @firmNr + '_CLCARD AS [Cariler]
      CROSS APPLY (
        SELECT
          SUM(
            CASE
              WHEN DEBIT < 0.1 THEN 0
              ELSE DEBIT
            END
          ) AS [Borç],
          SUM(
            CASE
              WHEN CREDIT < 0.1 THEN 0
              ELSE CREDIT
            END
          ) AS [Alacak]
        FROM
          ' + @totTable + '
        WHERE
          TOTTYPE = 1 AND
          MONTH_ <= @prmMonth AND
          YEAR_ = @prmYear AND
          ACCOUNTREF = (
            SELECT
              ACCOUNTREF
            FROM
              LG_' + @firmNr + '_CRDACREF
            WHERE
              TYP = 1 AND
              TRCODE = 5 AND
              CARDREF = Cariler.LOGICALREF
          )
      ) AS [Cari Toplamlari]
    WHERE
      [Cariler].ACTIVE = 0 AND (
        @prmClSpeCode = '''' OR
        [Cariler].SPECODE = @prmClSpeCode
      ) AND (
        @prmOnlyWithEmail = 0 OR (
          EMAILADDR <> '''' AND
          EMAILADDR IS NOT NULL
        )
      )
  ) AS t
  WHERE
    t.[Ad] <> '''' AND
    t.[Vergi No] <> '''' AND (
      @prmOnlyWithBalance = 0 OR
      t.[Tutar] <> 0
    ) AND (
      t.[Kod] LIKE ''%' + @search + '%'' OR
      t.[Ad] LIKE ''%' + @search + '%'' OR
      t.[Vergi No] LIKE ''%' + @search + '%''
    )
  ORDER BY
    t.[Ad]
'

EXECUTE sp_executesql
  @strSql,
  N'
    @prmMonth int,
    @prmYear int,
    @prmFormType varchar(6),
    @prmCurrency varchar(3),
    @prmClSpeCode varchar(10),
    @prmOnlyWithBalance bit,
    @prmOnlyWithEmail bit
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmCurrency = @currency,
  @prmClSpeCode = @clSpeCode,
  @prmOnlyWithBalance = @onlyWithBalance,
  @prmOnlyWithEmail = @onlyWithEmail,
  @prmFormType = 'Bakiye'