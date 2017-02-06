select
  NR as nr,
  BEGDATE as begDate,
  ENDDATE as endDate
from
  L_CAPIPERIOD
where
  ACTIVE = 1 and
  FIRMNR = @firmNr
