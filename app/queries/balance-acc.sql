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
          WHEN 30 THEN ''IQD''
          WHEN 31 THEN ''IRR''
          ELSE ''TRY''
        END
      ) AS [Para Birimi]      
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
          ) AND (
            (
              @prmCurrencyNr = [Cariler].CCURRENCY AND
              TOTTYPE = 1
            ) OR (
              @prmCurrencyNr <> [Cariler].CCURRENCY AND
              TOTTYPE = 2              
            )
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
    @prmOnlyWithEmail bit
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmCurrency = @currency,
  @prmCurrencyNr = @currencyNr,  
  @prmClSpeCode = @clSpeCode,
  @prmOnlyWithBalance = @onlyWithBalance,
  @prmOnlyWithEmail = @onlyWithEmail,
  @prmFormType = 'Bakiye'
