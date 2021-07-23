SELECT *
FROM conbavil
WHERE AUT='Boissonnade' AND PAUT='architecte' AND Depart='12'
AUT1 AUT2 (1990)
après: plus
--Depart='12' équivaut à LDepartActuel='Aveyron' 
--PAUT pour identifier sa profession, et ne garder que les mentions où il est architecte (plutôt qu'ingénieur par exemple)
--GROUP BY et COUNT pour répondre à la seconde partie de la question; mais on commence par voir combien il y en a