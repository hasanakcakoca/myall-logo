DECLARE @strSql nvarchar(MAX)

SET @strSql = N'
  SELECT
    @prmMonth AS [Ay],
    @prmYear AS [Yıl],
    @prmFormType AS [Form Tipi],
    @prmCurrency AS [Para Birimi],
    '''' AS [Alt Şirket Kodu],
    *
  FROM (
    SELECT
      DEFINITION_ AS [Ad],
      INCHARGE AS [İlgili Kişi],
      REPLACE(EMAILADDR, '';'', '','') AS [E-Posta],
      LTRIM(TELCODES1 + '' '' + TELNRS1) AS [Telefon],
      LTRIM(FAXCODE + '' '' + FAXNR) AS [Faks],
      [Vergi No],
      [Adet],
      [Tutar]
    FROM (    
        SELECT
          [Vergi No],
          SUM([Adet]) AS [Adet],
          SUM([Tutar]) AS [Tutar]
        FROM (
          SELECT
            (
              CASE ISPERSCOMP
                WHEN 1 THEN TCKNO
                ELSE TAXNR
              END
            ) AS [Vergi No],
            CAST([Muhasebe Fişleri].[Adet] AS float) AS Adet,
            CAST(CAST([Muhasebe Fişleri].[Tutar] AS float) AS int) AS Tutar
          FROM
            LG_' + @firmNr + '_CLCARD AS [Cariler]
            CROSS APPLY (
              SELECT
                COUNT(LOGICALREF) AS [Adet],
                ISNULL(SUM(CREDIT), 0) AS [Tutar]
              FROM
                LG_' + @firmNr + '_' + @periodNr + '_EMFLINE
              WHERE
                SIGN = 1 AND
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
            ACTIVE = 0 AND (
              CODE LIKE ''%' + @search + '%'' OR
              DEFINITION_ LIKE ''%' + @search + '%'' OR (
			          ISPERSCOMP = 1 AND
				        TCKNO LIKE ''%' + @search + '%''
			        ) OR (
			          ISPERSCOMP = 0 AND
				        TAXNR LIKE ''%' + @search + '%''
			        )
            ) AND (
              @prmClSpeCode = '''' OR
              SPECODE = @prmClSpeCode
            )
        ) AS tIn
        GROUP BY
          [Vergi No]
        HAVING
          [Vergi No] <> '''' AND
          SUM([Tutar]) >= @prmLimit    
      ) AS tOut
        INNER JOIN
          LG_' + @firmNr + '_CLCARD AS [Cariler] ON [Cariler].LOGICALREF = (
            SELECT
              TOP 1 LOGICALREF
            FROM
              LG_' + @firmNr + '_CLCARD
            WHERE
              (
                @prmOnlyWithEmail = 0 OR (
                  EMAILADDR <> '''' AND
                  EMAILADDR IS NOT NULL
                )
              ) AND (
                (ISPERSCOMP = 1 AND TCKNO = tOut.[Vergi No]) OR
                (ISPERSCOMP = 0 AND TAXNR = tOut.[Vergi No])
              )
          ) 
  ) AS t
  WHERE
    @prmUseMinimumTotal = 0 OR
    t.[Tutar] >= @prmMinimumTotal
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
    @prmFormType varchar(7),
    @prmUseMinimumTotal bit,
    @prmMinimumTotal float
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmLimit = @limit,
  @prmCurrency = @currency,
  @prmClSpeCode = @clSpeCode,
  @prmInvSpeCode = @invSpeCode,
  @prmOnlyWithEmail = @onlyWithEmail,
  @prmUseMinimumTotal = @useMinimumTotal,
  @prmMinimumTotal = @minimumTotal,  
  @prmFormType = 'Form BA'