declare @strMonth varchar(2)
declare @strYear varchar(4)
declare @totView varchar(20)
declare @totTable varchar(20)

declare @strSql nvarchar(MAX)

set @strMonth = cast(@month as varchar(2))
set @strYear = cast(@year as varchar(4))

set @totView = 'LV_' + @firmNr + '_' + @periodNr + '_CLTOTFIL'

if object_id(@totView) is null
    set @totTable = 'LG_' + @firmNr + '_' + @periodNr + '_CLTOTFIL'
else
    set @totTable = @totView

set @strSql = N'
  select
    ''Bakiye'' as [Form Tipi],
    ' + @strMonth + ' as [Ay],
    ' + @strYear + ' as [Yıl],
    *
  from (
    select
      DEFINITION_ as [Ad],
      (
        case ISPERSCOMP
            when 1 then TCKNO
            else TAXNR
        end
      ) as [Vergi No],
      SPECODE as [Ozel Kod],
      INCHARGE as [İlgili Kişi],
      EMAILADDR as [E-Posta],
      TELCODES1 + '' '' + TELNRS1 as [Telefon],
      FAXCODE + '' '' + FAXNR as [Faks],
      isnull(abs([Borç] - [Alacak]), 0) as [Tutar],
      (
          case
              when ([Borç] > [Alacak]) then ''Borçlu''
              when ([Borç] < [Alacak]) then ''Alacaklı''
              else ''''
          end
      ) as [Borç/Alacak]
    from
      LG_' + @firmNr + '_CLCARD as [Cariler]
      cross apply (
        select
            sum(DEBIT) as [Borç],
            sum(CREDIT) as [Alacak]
        from
            ' + @totTable + '
        where
            CARDREF = [Cariler].LOGICALREF and
            TOTTYP = 1 and
            MONTH_ <= ' + @strMonth + ' and
            YEAR_ = ' + @strYear + '
      ) as [Cari Toplamlari]
    where
        [Cariler].ACTIVE = 0
  ) as t
  where
    t.[Ad] <> '''' and
    t.[Vergi No] <> '''' and
    t.[Tutar] <> 0
  order by
    t.[Ad]
'

execute sp_executesql @strSql
