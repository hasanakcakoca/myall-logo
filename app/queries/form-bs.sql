declare @strLimit varchar(30)
declare @strMonth varchar(2)
declare @strYear varchar(4)
declare @strSql nvarchar(MAX)

set @strLimit = cast(@limit as varchar(30))
set @strMonth = cast(@month as varchar(2))
set @strYear = cast(@year as varchar(4))

set @strSql = N'
  select
    ''Form BS'' as [Form Tipi],
    ''TRY'' as [Para Birimi],
    ' + @strMonth + ' as [Ay],
    ' + @strYear + ' as [Yıl],
    *
  from (
    select
      DEFINITION_ as [Ad],
      (
        case ISPERSCOMP
            when 1 THEN TCKNO
            else TAXNR
        end
      ) as [Vergi No],
      SPECODE as [Ozel Kod],
      INCHARGE as [İlgili Kişi],
      EMAILADDR as [E-Posta],
      TELCODES1 + '' '' + TELNRS1 as [Telefon],
      FAXCODE + '' '' + FAXNR as [Faks],
      cast([Faturalar].[Adet] as float) + cast([Cari Fişleri].[Adet] as float) as Adet,
			cast([Faturalar].[Tutar] as float) + cast([Cari Fişleri].[Tutar] as float) as Tutar
    from
      LG_' + @firmNr + '_CLCARD as [Cariler]
      cross apply (
        select
          count(LOGICALREF) as [Adet],
          isnull(sum(GROSSTOTAL - TOTALDISCOUNTS), 0) as [Tutar]
        from
          LG_' + @firmNr + '_' + @periodNr + '_INVOICE
        where
          CANCELLED = 0 and
          TRCODE IN (6, 7, 8, 9) and
          CLIENTREF = Cariler.LOGICALREF and
          month(DATE_) = ' + @strMonth + ' and
          year(DATE_) = ' + @strYear + '
      ) as [Faturalar]
      cross apply (
        select
          count(LOGICALREF) AS [Adet],
          isnull(sum(BRUTAMOUNT), 0) as [Tutar]
        from
          LG_' + @firmNr + '_' + @periodNr + '_CLFLINE
        where
          TRCODE = 45 and
          CLIENTREF = [Cariler].LOGICALREF and
          month(DATE_) = ' + @strMonth + ' and
          year(DATE_) = ' + @strYear + '
      ) as [Cari Fişleri]
    where
        [Cariler].ACTIVE = 0 and
        [Faturalar].[Tutar] + [Cari Fişleri].[Tutar] >= ' +  @strLimit + '
  ) as t
  where
    t.[Ad] <> '''' and
    t.[Vergi No] <> ''''
  order by
    t.[Ad]
'

execute sp_executesql @strSql
