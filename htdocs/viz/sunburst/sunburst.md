# Conbavil Bar Chart

## description
Ce graphique présente donc le contenu de CONBAVIL par type architectural.

## fonctionnement
Le fait de cliquer sur une catégorie permet de faire apparaître le niveau de profondeur suivant et le retour en arrière s’effectue en cliquant au centre du graphique. En glissant le curseur sur une catégorie, on peut voir le nombre de délibérations qui y sont associées. 


## sources du code
- Mike Bostock
https://observablehq.com/@d3/zoomable-sunburst

- Packaged version on Github
https://github.com/vasturiano/sunburst-chart

- https://observablehq.com/d/40dc406921ab47a4

## librairie
- D3.js https://d3js.org

## source des données
### CONBAVIL

Ces données sont issues de la base de données CONBAVIL. Elles sont la propriété exclusive du Centre André-Chastel. Leur diffusion sur ce site est effectuée à seule fin de recherche, avec leur aimable autorisation. 

_CONBAVIL. Dépouillement analytique des procès-verbaux des séances du Conseil des Bâtiments civils (1795-1840)_ (2009) [Base de données en ligne], réalisée sous la direction de Françoise Boudon et Werner Szambien, Centre André Chastel (CRNS, UMR 8150), Paris : INHA. https://www.inha.fr/fr/ressources/outils-documentaires/conseil-des-batiments-civils-conbavil.html. Tous droits réservés, Centre André Chastel.

- `conbavil.json`: Export de la base de données CONBAVIL (Filemaker) en XML par Emmanuel Château-Dutier. Extrait transformé en JSON pour les présentes visualisations par Lena Krause, avec l'aide notamment de Stéfan Sinclair. 


### catégories
Index des catégories des édifices dans CONBAVIL.

- `categories.json`: Index élaboré à partir de CONBAVIL et du Thésaurus de la désignation des œuvres architecturales et des espaces aménagés  Vergain, Philippe (dir.). 2015. Thésaurus de la désignation des œuvres architecturales et des espaces aménagés, Inventaire général du patrimoine culturel. Ministère de la culture et de la communication. <http://data.culture.fr/thesaurus/resource/ark:/67717/T96>.
