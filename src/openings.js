const OPENINGS = [
{
  id: 'italienne', name: 'Partie italienne', side: 'w', style: 'Classique · idéale pour débuter',
  summary: "Les Blancs développent vite, roquent et visent f7, le point faible des Noirs. L'ouverture parfaite pour apprendre les principes.",
  plans: ["Développer cavaliers et fous avant de sortir la dame", "Préparer d4 avec c3 pour prendre le centre", "Roquer vite, puis Te1 et Cbd2-f1-g3"],
  moves: [
    { m: 'e4', t: "Le pion prend le centre, contrôle d5 et f5, et ouvre la route au fou f1 et à la dame.", a: [['e4', 'd5', 'plan'], ['e4', 'f5', 'plan'], ['f1', 'c4', 'plan']] },
    { m: 'e5', t: "Les Noirs répondent pareil : ils bloquent le pion e4 et réclament leur part du centre.", a: [['e5', 'd4', 'plan'], ['e5', 'f4', 'plan']] },
    { m: 'Nf3', t: "Le cavalier sort vers le centre et attaque déjà le pion e5.", a: [['f3', 'e5', 'threat']] },
    { m: 'Nc6', t: "Les Noirs défendent e5 tout en développant une pièce. Deux objectifs en un coup.", a: [['c6', 'e5', 'plan']] },
    { m: 'Bc4', t: "Le fou vise f7, la case faible des Noirs : seul le roi la défend.", a: [['c4', 'f7', 'threat']], sq: ['f7'] },
    { m: 'Bc5', t: "Coup miroir : le fou noir vise f2, la case faible des Blancs.", a: [['c5', 'f2', 'threat']], sq: ['f2'] },
    { m: 'c3', t: "Discret mais important : ce pion prépare d4 pour chasser le fou c5 et prendre le centre.", a: [['d2', 'd4', 'plan'], ['c3', 'd4', 'plan']] },
    { m: 'Nf6', t: "Les Noirs développent et attaquent e4. Il faut s'en occuper.", a: [['f6', 'e4', 'threat']] },
    { m: 'd3', t: "Défense solide de e4. C'est la version calme (le « Giuoco Pianissimo ») : d4 viendra plus tard.", a: [['d3', 'e4', 'plan']] },
    { m: 'd6', t: "Les Noirs consolident e5 et ouvrent la diagonale du fou c8.", a: [['d6', 'e5', 'plan'], ['c8', 'g4', 'plan']] },
    { m: 'O-O', t: "Le roi se met à l'abri et la tour se rapproche du centre. Plan suivant : Te1, Cbd2 puis Cf1-g3.", a: [['f1', 'e1', 'plan'], ['b1', 'd2', 'plan']] },
    { m: 'O-O', t: "Les deux rois sont en sécurité. La bataille se jouera autour de d4 et sur l'aile roi.", a: [] }
  ]
},
{
  id: 'espagnole', name: 'Partie espagnole', side: 'w', style: 'Stratégique · la reine des ouvertures',
  summary: "Au lieu de viser f7, le fou attaque le cavalier qui défend e5. Une pression lente mais qui dure toute la partie.",
  plans: ["Maintenir la pression sur c6 et e5", "Préparer d4 avec c3 (et garder la case c2 pour le fou)", "Manœuvre typique Cbd2-f1-g3 vers l'aile roi"],
  moves: [
    { m: 'e4', t: "Le pion prend le centre et libère le fou et la dame.", a: [['e4', 'd5', 'plan'], ['e4', 'f5', 'plan']] },
    { m: 'e5', t: "Les Noirs réclament leur part du centre.", a: [] },
    { m: 'Nf3', t: "Développement avec attaque sur e5.", a: [['f3', 'e5', 'threat']] },
    { m: 'Nc6', t: "Le cavalier défend e5.", a: [['c6', 'e5', 'plan']] },
    { m: 'Bb5', t: "L'idée espagnole : le fou attaque le cavalier c6, le défenseur de e5. Pression indirecte sur le centre.", a: [['b5', 'c6', 'threat'], ['c6', 'e5', 'plan']], sq: ['e5'] },
    { m: 'a6', t: "Les Noirs demandent au fou de se décider : reculer ou échanger.", a: [['a6', 'b5', 'threat']] },
    { m: 'Ba4', t: "Le fou recule mais garde le cavalier c6 dans son viseur. (Fxc6 serait la variante d'échange.)", a: [['a4', 'c6', 'threat']] },
    { m: 'Nf6', t: "Contre-attaque sur e4.", a: [['f6', 'e4', 'threat']] },
    { m: 'O-O', t: "Les Blancs roquent sans défendre e4 : si Cxe4, Te1 récupère le pion avec un bon jeu.", a: [['f1', 'e1', 'plan']] },
    { m: 'Be7', t: "Les Noirs préparent leur roque. C'est la variante fermée, la plus jouée.", a: [['e8', 'g8', 'plan']] },
    { m: 'Re1', t: "La tour défend e4 et prépare c3 puis d4.", a: [['e1', 'e4', 'plan']] },
    { m: 'b5', t: "Les Noirs chassent le fou et gagnent de l'espace à l'aile dame.", a: [['b5', 'a4', 'threat']] },
    { m: 'Bb3', t: "Le fou retrouve la diagonale qui mène à f7.", a: [['b3', 'f7', 'threat']] },
    { m: 'd6', t: "Les Noirs soutiennent e5 et libèrent le fou c8.", a: [['d6', 'e5', 'plan']] },
    { m: 'c3', t: "Prépare d4 et offre une case de repli en c2 au fou si les Noirs jouent Ca5.", a: [['d2', 'd4', 'plan'], ['b3', 'c2', 'plan']] },
    { m: 'O-O', t: "Position typique de l'Espagnole fermée. Les Blancs vont jouer h3, d4 et Cbd2-f1-g3.", a: [['b1', 'd2', 'plan']] }
  ]
},
{
  id: 'gambit-dame', name: 'Gambit dame refusé', side: 'w', style: 'Positionnelle · solide',
  summary: "Les Blancs offrent le pion c4 pour détourner le pion d5 du centre. Les Noirs refusent et gardent leur pion central.",
  plans: ["Pression sur d5 avec Cc3, Fg5 et Tc1", "Clouer le cavalier f6 qui défend d5", "Plus tard, l'attaque de minorité b4-b5"],
  moves: [
    { m: 'd4', t: "Le pion d prend le centre, déjà protégé par la dame.", a: [['d4', 'e5', 'plan'], ['d4', 'c5', 'plan']] },
    { m: 'd5', t: "Les Noirs bloquent le pion d4.", a: [] },
    { m: 'c4', t: "Le gambit : les Blancs offrent un pion pour détourner d5 du centre.", a: [['c4', 'd5', 'threat']] },
    { m: 'e6', t: "Les Noirs refusent et soutiennent d5. Le prix à payer : le fou c8 est un peu enfermé.", a: [['e6', 'd5', 'plan']], sq: ['c8'] },
    { m: 'Nc3', t: "Encore plus de pression sur d5.", a: [['c3', 'd5', 'threat']] },
    { m: 'Nf6', t: "Le cavalier défend d5 à son tour.", a: [['f6', 'd5', 'plan']] },
    { m: 'Bg5', t: "Clouage : le cavalier f6 défend d5, mais s'il bouge, la dame d8 est exposée.", a: [['g5', 'f6', 'threat'], ['f6', 'd8', 'plan']], sq: ['f6'] },
    { m: 'Be7', t: "Les Noirs se déclouent en interposant le fou.", a: [['e7', 'g5', 'plan']] },
    { m: 'e3', t: "Ouvre la diagonale du fou f1.", a: [['f1', 'd3', 'plan']] },
    { m: 'O-O', t: "Roi à l'abri.", a: [] },
    { m: 'Nf3', t: "Développement terminé côté roi. Plan suivant : Tc1, Fd3 et pression sur la colonne c.", a: [['a1', 'c1', 'plan'], ['f1', 'd3', 'plan']] }
  ]
},
{
  id: 'londres', name: 'Système de Londres', side: 'w', style: 'Système · facile à retenir',
  summary: "Un système plutôt qu'une ouverture : les Blancs jouent presque toujours les mêmes coups, peu importe les Noirs.",
  plans: ["Triangle de pions c3-d4-e3", "Fou f4 sorti avant e3", "Cavalier en e5 puis attaque à l'aile roi"],
  moves: [
    { m: 'd4', t: "Le pion prend le centre.", a: [['d4', 'e5', 'plan']] },
    { m: 'd5', t: "Les Noirs bloquent.", a: [] },
    { m: 'Bf4', t: "Le fou sort avant e3, sinon il serait enfermé derrière ses pions.", a: [['f4', 'b8', 'plan']] },
    { m: 'Nf6', t: "Développement naturel.", a: [] },
    { m: 'e3', t: "Consolide d4 et ouvre la route au fou f1.", a: [['f1', 'd3', 'plan']] },
    { m: 'e6', t: "Les Noirs ouvrent leur fou f8.", a: [] },
    { m: 'Nf3', t: "Développement et contrôle de e5.", a: [['f3', 'e5', 'plan']] },
    { m: 'c5', t: "Les Noirs attaquent d4.", a: [['c5', 'd4', 'threat']] },
    { m: 'c3', t: "Le triangle c3-d4-e3 est en place : d4 est solide comme un roc.", a: [['c3', 'd4', 'plan'], ['e3', 'd4', 'plan']], sq: ['d4'] },
    { m: 'Nc6', t: "Encore une pression sur d4.", a: [['c6', 'd4', 'threat']] },
    { m: 'Nbd2', t: "Le cavalier soutient e4 et peut aller en f3 si besoin.", a: [['d2', 'e4', 'plan']] },
    { m: 'Bd6', t: "Les Noirs proposent l'échange des fous.", a: [['d6', 'f4', 'threat']] },
    { m: 'Bg3', t: "Les Blancs gardent leur fou actif sur la même diagonale.", a: [['g3', 'd6', 'plan']] },
    { m: 'O-O', t: "Les Noirs mettent leur roi à l'abri.", a: [] },
    { m: 'Bd3', t: "Le fou vise h7. Plan typique : Ce5, puis f4 et attaque sur le roi.", a: [['d3', 'h7', 'threat'], ['f3', 'e5', 'plan']], sq: ['h7'] }
  ]
},
{
  id: 'caro-kann', name: 'Défense Caro-Kann', side: 'b', style: 'Solide · idéale pour débuter avec les Noirs',
  summary: "Comme la Française, les Noirs attaquent e4 avec d5, mais le fou c8 peut sortir avant de fermer la position.",
  plans: ["Sortir le fou c8 avant de jouer e6", "Structure solide, peu de faiblesses", "Ensuite : Cgf6, e6, Fe7 et roque"],
  moves: [
    { m: 'e4', t: "Les Blancs prennent le centre.", a: [] },
    { m: 'c6', t: "Prépare d5 sans bloquer le fou c8.", a: [['c6', 'd5', 'plan'], ['c8', 'f5', 'plan']] },
    { m: 'd4', t: "Les Blancs occupent tout le centre.", a: [] },
    { m: 'd5', t: "Les Noirs attaquent e4.", a: [['d5', 'e4', 'threat']] },
    { m: 'Nc3', t: "Le cavalier défend e4.", a: [['c3', 'e4', 'plan']] },
    { m: 'dxe4', t: "Les Noirs échangent pour libérer leur jeu.", a: [] },
    { m: 'Nxe4', t: "Le cavalier reprend, bien placé au centre.", a: [] },
    { m: 'Bf5', t: "Voilà l'idée : le fou sort avant e6, et en plus il attaque le cavalier.", a: [['f5', 'e4', 'threat']] },
    { m: 'Ng3', t: "Le cavalier recule en attaquant le fou.", a: [['g3', 'f5', 'threat']] },
    { m: 'Bg6', t: "Le fou reste sur sa bonne diagonale.", a: [['g6', 'b1', 'plan']] },
    { m: 'h4', t: "Les Blancs menacent h5 pour piéger le fou g6.", a: [['h4', 'h5', 'threat']], sq: ['g6'] },
    { m: 'h6', t: "Les Noirs offrent une case de fuite en h7 au fou.", a: [['g6', 'h7', 'plan']] },
    { m: 'Nf3', t: "Développement. Les Blancs visent e5.", a: [['f3', 'e5', 'plan']] },
    { m: 'Nd7', t: "Le cavalier contrôle e5 : les Blancs n'y installeront pas leur cavalier.", a: [['d7', 'e5', 'plan']], sq: ['e5'] }
  ]
},
{
  id: 'scandinave', name: 'Défense scandinave', side: 'b', style: 'Directe · plan simple',
  summary: "Les Noirs attaquent e4 dès le premier coup. Simple à jouer, avec un plan clair et une structure solide.",
  plans: ["Dame en a5, active et difficile à chasser", "Fou c8 sorti en f5 avant e6", "Structure solide c6-e6, puis roque"],
  moves: [
    { m: 'e4', t: "Les Blancs prennent le centre.", a: [] },
    { m: 'd5', t: "Attaque immédiate du pion e4.", a: [['d5', 'e4', 'threat']] },
    { m: 'exd5', t: "Les Blancs prennent.", a: [] },
    { m: 'Qxd5', t: "La dame reprend. Elle sort tôt, mais c'est le principe de cette ouverture.", a: [] },
    { m: 'Nc3', t: "Les Blancs gagnent un temps en attaquant la dame.", a: [['c3', 'd5', 'threat']] },
    { m: 'Qa5', t: "La dame se range en a5, loin des attaques, et surveille la diagonale jusqu'à e1.", a: [['a5', 'e1', 'plan']] },
    { m: 'd4', t: "Les Blancs occupent le centre. Attention : le cavalier c3 est maintenant cloué sur le roi.", a: [['a5', 'c3', 'threat']], sq: ['c3'] },
    { m: 'Nf6', t: "Développement.", a: [] },
    { m: 'Nf3', t: "Développement des Blancs.", a: [] },
    { m: 'c6', t: "Offre une case de retraite en c7 à la dame et contrôle d5 et b5.", a: [['a5', 'c7', 'plan']] },
    { m: 'Bc4', t: "Le fou blanc vise f7.", a: [['c4', 'f7', 'threat']] },
    { m: 'Bf5', t: "Le fou sort avant e6. Suite : e6, Cbd7 et le roque.", a: [['e7', 'e6', 'plan']] }
  ]
},
{
  id: 'francaise', name: 'Défense française', side: 'b', style: 'Solide · contre-attaque',
  summary: "Les Noirs préparent d5 avec e6. Ils laissent de l'espace aux Blancs, puis attaquent leur chaîne de pions.",
  plans: ["Attaquer la base de la chaîne (d4) avec c5", "Pression sur d4 avec Cc6 et Db6", "Point faible : le fou c8, enfermé derrière e6"],
  moves: [
    { m: 'e4', t: "Les Blancs prennent le centre.", a: [] },
    { m: 'e6', t: "Coup modeste qui prépare d5.", a: [['e6', 'd5', 'plan']] },
    { m: 'd4', t: "Les Blancs prennent tout le centre.", a: [] },
    { m: 'd5', t: "Les Noirs attaquent e4.", a: [['d5', 'e4', 'threat']] },
    { m: 'Nc3', t: "Le cavalier défend e4.", a: [['c3', 'e4', 'plan']] },
    { m: 'Nf6', t: "Deuxième attaque sur e4 : c'est la variante classique.", a: [['f6', 'e4', 'threat']] },
    { m: 'e5', t: "Les Blancs avancent, gagnent de l'espace et chassent le cavalier.", a: [['e5', 'f6', 'threat']] },
    { m: 'Nfd7', t: "Le cavalier recule, prêt à attaquer e5.", a: [['d7', 'e5', 'plan']] },
    { m: 'f4', t: "Variante Steinitz : le pion f soutient solidement e5.", a: [['f4', 'e5', 'plan']] },
    { m: 'c5', t: "Le coup-clé de la Française : on attaque la base de la chaîne blanche, le pion d4.", a: [['c5', 'd4', 'threat']], sq: ['d4'] },
    { m: 'Nf3', t: "Les Blancs défendent d4.", a: [['f3', 'd4', 'plan']] },
    { m: 'Nc6', t: "Encore plus de pression sur d4. Prochaine étape : Db6.", a: [['c6', 'd4', 'threat'], ['d8', 'b6', 'plan']] }
  ]
},
{
  id: 'sicilienne', name: 'Sicilienne Najdorf', side: 'b', style: 'Tranchante · pour jouer le gain',
  summary: "Les Noirs contestent le centre de côté avec c5. La position est déséquilibrée : parfaite pour jouer pour le gain.",
  plans: ["Utiliser la colonne c semi-ouverte (Tc8, Dc7)", "Jouer e5 ou e6 selon le moment", "Contre-attaque à l'aile dame avec b5"],
  moves: [
    { m: 'e4', t: "Les Blancs prennent le centre.", a: [] },
    { m: 'c5', t: "Le pion c contrôle d4 sans se placer face à e4. Un combat asymétrique commence.", a: [['c5', 'd4', 'plan']] },
    { m: 'Nf3', t: "Les Blancs développent et préparent d4.", a: [['f3', 'd4', 'plan']] },
    { m: 'd6', t: "Contrôle e5 et prépare Cf6.", a: [['d6', 'e5', 'plan']] },
    { m: 'd4', t: "Les Blancs ouvrent le centre tout de suite.", a: [['d4', 'c5', 'threat']] },
    { m: 'cxd4', t: "Les Noirs échangent un pion de l'aile contre un pion central : deux pions centraux contre un, et la colonne c s'ouvre.", a: [['c8', 'c1', 'plan']] },
    { m: 'Nxd4', t: "Le cavalier reprend et trône au centre.", a: [] },
    { m: 'Nf6', t: "Attaque e4 en développant.", a: [['f6', 'e4', 'threat']] },
    { m: 'Nc3', t: "Le cavalier défend e4.", a: [['c3', 'e4', 'plan']] },
    { m: 'a6', t: "La Najdorf : ce petit coup contrôle b5 (plus de Cb5 ni de Fb5) et prépare e5 ou b5.", a: [['a6', 'b5', 'plan'], ['e7', 'e5', 'plan']], sq: ['b5'] }
  ]
}
];
if (typeof module !== 'undefined') module.exports = OPENINGS;
