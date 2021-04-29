DECLARE @totView varchar(20)
DECLARE @totTable varchar(20)
DECLARE @strSql nvarchar(MAX)

SET @totView = 'LV_' + @firmNr + '_' + @periodNr + '_CLTOTFIL'

IF OBJECT_ID(@totView) IS NULL
  SET @totTable = 'LG_' + @firmNr + '_' + @periodNr + '_CLTOTFIL'
ELSE
  SET @totTable = @totView

SET @strSql = N'
  SELECT
    0 AS [Adet],
    @prmMonth AS [Ay],
    @prmYear AS [Yıl],
    @prmFormType AS [Form Tipi],
    *
  FROM (
    SELECT
      CODE AS [Alt Şirket Kodu],
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
      ) AS [Borç/Alacak],
      (
        CASE CCURRENCY
          WHEN 1 THEN ''USD''
          WHEN 3 THEN ''AUD''
          WHEN 13 THEN ''JPY''
          WHEN 14 THEN ''CAD''
          WHEN 15 THEN ''KWD''
          WHEN 17 THEN ''GBP''
          WHEN 18 THEN ''SAR''
          WHEN 20 THEN ''EUR''
          WHEN 25 THEN ''CNY''          
          WHEN 30 THEN ''IQD''
          WHEN 31 THEN ''IRR''
          ELSE ''TRY''
        END
      ) AS [Para Birimi],
      [Tutar (TRY)]     
    FROM
      LG_' + @firmNr + '_CLCARD AS [Cariler]
      CROSS APPLY (
        SELECT
          *
        FROM
        (
          SELECT            
            SUM(
              CASE
                WHEN SIGN = 0 THEN TRNET
                ELSE 0
              END
            ) AS [Borç],
            SUM(
              CASE
                WHEN SIGN = 1 THEN TRNET
                ELSE 0
              END              
            ) AS [Alacak],
            ABS(SUM((1 - SIGN) * AMOUNT) - SUM(SIGN * AMOUNT)) AS [Tutar (TRY)]
          FROM
            LG_' + @firmNr + '_' + @periodNr + '_CLFLINE
          WHERE
            @prmUseTrCurrency = 1 AND

            CANCELLED = 0 AND
            TRCURR = @prmTrCurrencyNr AND
            CLIENTREF = [Cariler].LOGICALREF AND            
            (
              (MONTH_ <= @prmMonth AND YEAR_ = @prmYear) OR
              (YEAR_ < @prmYear)
            )

          UNION ALL

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
            ) AS [Alacak],
            ABS(SUM(DEBIT) - SUM(CREDIT)) AS [Tutar (TRY)]
          FROM
            ' + @totTable + '
          WHERE
            @prmUseTrCurrency = 0 AND

            CARDREF = [Cariler].LOGICALREF AND
            (
              (MONTH_ <= @prmMonth AND YEAR_ = @prmYear) OR
              (YEAR_ < @prmYear)
            ) AND
            (
              (
                @prmCurrencyNr = [Cariler].CCURRENCY AND
                TOTTYP = 1
              ) OR (
                @prmCurrencyNr <> [Cariler].CCURRENCY AND
                TOTTYP = 2              
              )
            )
        ) AS [Cari Bakiye]
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
      ) AND (
        @prmUseTrCurrency = 0 OR (
          [Cariler].CCURRENCY = @prmTrCurrencyNr
        )
      )
  ) AS t
  WHERE
    t.[Ad] <> '''' AND
    t.[Vergi No] <> '''' AND (
      @prmOnlyWithBalance = 0 OR
      t.[Tutar] <> 0
    ) AND (
      @prmUseMinimumTotal = 0 OR
      t.[Tutar] >= @prmMinimumTotal
    ) AND (
      t.[Alt Şirket Kodu] LIKE ''%' + @search + '%'' OR
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
    @prmCurrencyNr int,    
    @prmClSpeCode varchar(10),
    @prmOnlyWithBalance bit,
    @prmOnlyWithEmail bit,
    @prmUseMinimumTotal bit,
    @prmMinimumTotal float,
    @prmUseTrCurrency bit,
    @prmTrCurrencyNr int
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmCurrency = @currency,
  @prmCurrencyNr = @currencyNr,
  @prmClSpeCode = @clSpeCode,
  @prmOnlyWithBalance = @onlyWithBalance,
  @prmOnlyWithEmail = @onlyWithEmail,
  @prmUseMinimumTotal = @useMinimumTotal,
  @prmMinimumTotal = @minimumTotal,
  @prmUseTrCurrency = @useTrCurrency,
  @prmTrCurrencyNr = @trCurrencyNr,
  @prmFormType = 'Bakiye'
