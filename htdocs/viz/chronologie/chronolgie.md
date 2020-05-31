# Chronologie

## description
chronologie des séances du Conseil précisant le nombre de projets évalués à chaque occurrence. 
Ce graphique permet ainsi de rendre compte de la fréquence des séances du Conseil et de la quantité d’affaires traitées au fil du temps. 

## fonctionnement
Grâce à la fonction de zoom, l’utilisateur peut modifier l’axe chronologique et examiner de manière détaillée des intervalles temporels plus restreints. 
En dessous, la légende, qui est elle-même un graphique, sert de repère. Elle situe la section visualisée et propose un autre moyen de parcourir la chronologie.

## sources du code
https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172

https://web.archive.org/web/20191209202101/https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172 

## librairie
- D3.js https://d3js.org

## source des données
### CONBAVIL

Ces données sont issues de la base de données CONBAVIL. Elles sont la propriété exclusive du Centre André-Chastel. Leur diffusion sur ce site est effectuée à seule fin de recherche, avec leur aimable autorisation. 

_CONBAVIL. Dépouillement analytique des procès-verbaux des séances du Conseil des Bâtiments civils (1795-1840)_ (2009) [Base de données en ligne], réalisée sous la direction de Françoise Boudon et Werner Szambien, Centre André Chastel (CRNS, UMR 8150), Paris : INHA. https://www.inha.fr/fr/ressources/outils-documentaires/conseil-des-batiments-civils-conbavil.html. Tous droits réservés, Centre André Chastel.

- `conbavil.json`: Export de la base de données CONBAVIL (Filemaker) en XML par Emmanuel Château-Dutier. Extrait transformé en JSON pour les présentes visualisations par Lena Krause, avec l'aide notamment de Stéfan Sinclair. 