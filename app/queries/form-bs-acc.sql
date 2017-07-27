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
      CAST([Muhasebe Fişleri].[Adet] AS float) AS Adet,
	    CAST(CAST([Muhasebe Fişleri].[Tutar] AS float) AS int) AS Tutar
    FROM
      LG_' + @firmNr + '_CLCARD AS [Cariler]
      CROSS APPLY (
        SELECT
          COUNT(LOGICALREF) AS [Adet],
          ISNULL(SUM(DEBIT), 0) AS [Tutar]
        FROM
          LG_' + @firmNr + '_' + @periodNr + '_EMFLINE
        WHERE
          SIGN = 0 AND
          CANCELLED = 0 AND   
          FORTAXDECL = 1 AND       
          MONTH(DATE_) = @prmMonth AND
          YEAR(DATE_) = @prmYear AND (
            @prmInvSpeCode = '''' OR
            SPECODE = @prmInvSpeCode
          ) AND
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
      ) AS [Muhasebe Fişleri]
    WHERE
      [Cariler].ACTIVE = 0 AND
      [Muhasebe Fişleri].[Tutar] >= @prmLimit AND (
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
    @prmLimit float,
    @prmCurrency varchar(3),
    @prmClSpeCode varchar(10),
    @prmInvSpeCode varchar(10),
    @prmOnlyWithEmail bit,
    @prmFormType varchar(7)
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmLimit = @limit,
  @prmCurrency = @currency,
  @prmClSpeCode = @clSpeCode,
  @prmInvSpeCode = @invSpeCode,
  @prmOnlyWithEmail = @onlyWithEmail,
  @prmFormType = 'Form BS'