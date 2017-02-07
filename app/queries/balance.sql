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
    @prmMonth AS [Ay],
    @prmYear AS [Yıl],
    @prmFormType AS [Form Tipi],
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
      ISNULL(abs([Borç] - [Alacak]), 0) AS [Tutar],
      (
        CASE
          WHEN ([Borç] > [Alacak]) THEN ''Borçlu''
          WHEN ([Borç] < [Alacak]) THEN ''Alacaklı''
          ELSE ''''
        END
      ) AS [Borç/Alacak]
    FROM
      LG_' + @firmNr + '_CLCARD AS [Cariler]
      CROSS APPLY (
        SELECT
          SUM(DEBIT) AS [Borç],
          SUM(CREDIT) AS [Alacak]
        FROM
          ' + @totTable + '
        WHERE
          CARDREF = [Cariler].LOGICALREF AND
          TOTTYP = 1 AND
          MONTH_ <= @prmMonth AND
          YEAR_ = @prmYear
      ) AS [Cari Toplamlari]
    WHERE
      [Cariler].ACTIVE = 0
  ) AS t
  WHERE
    t.[Ad] <> '''' AND
    t.[Vergi No] <> '''' AND
    t.[Tutar] <> 0
  ORDER BY
    t.[Ad]
'

EXECUTE sp_executesql
  @strSql,
  N'
    @prmMonth int,
    @prmYear int,
    @prmFormType varchar(6)
  ',
  @prmMonth = @month,
  @prmYear = @year,
  @prmFormType = 'Bakiye'
