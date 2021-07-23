# Conbavil Bar Chart

## description
Ce diagramme en bâton figure les séances du Conseil des bâtiments civils dont les procès-verbaux sont intégrés dans la base de données CONBAVIL. Chaque barre représente une séance et sa hauteur le nombre de délibérations.
La couleur des barres est encodée en fonction de sa hauteur, et donc du nombre de délibérations: dégradé du jaune clair, petit nombre de délibération, au bleu foncé, grand nombre de délibérations. La légende des couleurs sera ajoutée prochainement.
L'affichage des dates ne fonctionne pas encore. 


## fonctionnement
Lorsque la souris survole une barre, celle-ci devient rouge.

La sélection d’une barre par un clic active l’affichage des délibérations concernées. 
Les barres sélectionnées sont en orange, cliquer pour annuler la sélection. 

Le zoom agrandit l'image sans changer d'échelle.

## source du code 
- https://observablehq.com/d/69c976be802105cc

## librairie
- D3.js https://d3js.org

## source des données
### CONBAVIL

Ces données sont issues de la base de données CONBAVIL. Elles sont la propriété exclusive du Centre André-Chastel. Leur diffusion sur ce site est effectuée à seule fin de recherche, avec leur aimable autorisation. 

_CONBAVIL. Dépouillement analytique des procès-verbaux des séances du Conseil des Bâtiments civils (1795-1840)_ (2009) [Base de données en ligne], réalisée sous la direction de Françoise Boudon et Werner Szambien, Centre André Chastel (CRNS, UMR 8150), Paris : INHA. https://www.inha.fr/fr/ressources/outils-documentaires/conseil-des-batiments-civils-conbavil.html. Tous droits réservés, Centre André Chastel.

- `conbavil.json`: Export de la base de données CONBAVIL (Filemaker) en XML par Emmanuel Château-Dutier. Extrait transformé en JSON pour les présentes visualisations par Lena Krause, avec l'aide notamment de Stéfan Sinclair. 