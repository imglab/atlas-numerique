SELECT *
FROM conbavil
WHERE (DAR BETWEEN '1802-01-01' AND '1810-12-31') AND Depart='58' AND Dénomination 'église' AND PJTypeIntervention='nouvelle affectation'

--Depart='58' équivaut à LDepartActuel='Nièvre' 
--Dénomination='église' peut être échangé avec 'école'