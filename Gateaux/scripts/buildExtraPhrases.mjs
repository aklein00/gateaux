import { readFileSync, writeFileSync } from 'fs';

function p(id, language, category, native, english, pronunciation, formality, wrongEn, wrongNative) {
    const key = language === 'french' ? 'french' : 'spanish';
    return {
        id,
        language,
        category,
        [key]: native,
        english,
        pronunciation,
        context: 'Café counter talk',
        correction: `${native} means “${english}.”`,
        formality,
        wrong_answers_en: wrongEn,
        wrong_answers_native: wrongNative
    };
}

const extra = [];

function add(category, lang, rows, formality) {
    const prefix = lang === 'french' ? 'fr' : 'es';
    const slug = {
        greetings_casual: 'greet_casual',
        cafe_slang: 'slang',
        small_talk: 'small',
        farewells: 'farewell',
        greetings_formal: 'greet_formal',
        taking_orders: 'order_formal',
        apologies_excuses: 'sorry',
        food_praise: 'praise',
        handling_rush: 'rush',
        sweet_talk: 'sweet',
        complaints_dept: 'complaint',
        passive_aggressive: 'shade'
    }[category];
    rows.forEach((row, i) => {
        extra.push(p(
            `${prefix}_${slug}_${i + 6}`,
            lang,
            category,
            row[0], row[1], row[2], formality,
            row[3], row[4]
        ));
    });
}

add('greetings_casual', 'french', [
    ['Wesh, ça va ?', 'Hey, you good?', 'wesh sah VAH', ['Good evening, sir.', 'The bill, please.', 'I am lost.'], ['Bonsoir, monsieur.', "L'addition, s'il vous plaît.", 'Je suis perdu.']],
    ['T’es en forme ?', 'You doing alright?', 'tay ahn FORM', ['Are you closed?', 'Where is the bathroom?', 'I want water.'], ['Vous êtes fermés ?', 'Où sont les toilettes ?', "Je veux de l'eau."]],
    ['Tranquille ?', 'All good?', 'trahn-KEEL', ['Two coffees.', 'See you tomorrow.', 'That is expensive.'], ['Deux cafés.', 'À demain.', "C'est cher."]],
    ['Quoi de beau ?', "What's good?", 'kwah duh BO', ['I need sugar.', 'Open the window.', 'Call a taxi.'], ['Il me faut du sucre.', 'Ouvre la fenêtre.', 'Appelez un taxi.']],
    ['On se fait une pause ?', 'We grabbing a break?', 'ohn suh fay ewn pohz', ['The kitchen is on fire.', 'I speak English.', 'No ice.'], ['La cuisine brûle.', "Je parle anglais.", 'Pas de glace.']],
    ['Bien ou quoi ?', 'Good or what?', 'byan oo KWAH', ['Please sit down.', 'I am allergic.', 'The wifi password.'], ['Asseyez-vous.', 'Je suis allergique.', 'Le mot de passe wifi.']],
    ['Ça gaze ?', 'How’s it going?', 'sah GAHz', ['I want a refund.', 'Do you have milk?', 'Good night.'], ['Je veux un remboursement.', 'Vous avez du lait ?', 'Bonne nuit.']],
    ['Nickel.', 'All good / perfect.', 'nee-KEL', ['I am angry.', 'This is burnt.', 'Call the manager.'], ['Je suis en colère.', "C'est brûlé.", 'Appelez le gérant.']],
    ['Allez hop.', 'Come on, let’s go.', 'ah-lay OP', ['Slowly, please.', 'I will wait outside.', 'No more coffee.'], ['Lentement, s’il vous plaît.', "J'attends dehors.", 'Plus de café.']],
    ['On y va.', "Let's go.", 'ohn nee VAH', ['Stay here.', 'I need a napkin.', 'That is too sweet.'], ['Reste ici.', "J'ai besoin d'une serviette.", "C'est trop sucré."]]
], 'casual');

add('greetings_casual', 'spanish', [
    ['¿Qué onda, güey?', "What's up, dude?", 'keh ON-dah gway', ['Good evening, ma’am.', 'The check, please.', 'I am lost.'], ['Buenas noches, señora.', 'La cuenta, por favor.', 'Estoy perdido.']],
    ['¿Todo bien?', 'All good?', 'TOH-doh byehn', ['Are you closed?', 'Where is the bathroom?', 'I want water.'], ['¿Están cerrados?', '¿Dónde está el baño?', 'Quiero agua.']],
    ['¿Qué milagro?', 'Look who showed up!', 'keh mee-LAH-groh', ['Two coffees.', 'See you tomorrow.', 'That is expensive.'], ['Dos cafés.', 'Hasta mañana.', 'Está caro.']],
    ['¿Qué hubo?', "What's happening?", 'keh OO-boh', ['I need sugar.', 'Open the window.', 'Call a taxi.'], ['Necesito azúcar.', 'Abre la ventana.', 'Llama un taxi.']],
    ['¿Andas por acá?', 'You around here?', 'AHN-das por ah-KAH', ['The kitchen is on fire.', 'I speak English.', 'No ice.'], ['La cocina está en llamas.', 'Hablo inglés.', 'Sin hielo.']],
    ['¿Cómo andamos?', 'How we doing?', 'KOH-moh AHN-dah-mohs', ['Please sit down.', 'I am allergic.', 'The wifi password.'], ['Siéntese, por favor.', 'Soy alérgico.', 'La contraseña del wifi.']],
    ['¿Pura vida?', 'All good / living well?', 'POO-rah VEE-dah', ['I want a refund.', 'Do you have milk?', 'Good night.'], ['Quiero un reembolso.', '¿Tienen leche?', 'Buenas noches.']],
    ['Todo tranqui.', 'All chill.', 'TOH-doh TRAHN-kee', ['I am angry.', 'This is burnt.', 'Call the manager.'], ['Estoy enojado.', 'Esto está quemado.', 'Llame al gerente.']],
    ['¡Órale pues!', 'Alright then!', 'OH-rah-leh pwes', ['Slowly, please.', 'I will wait outside.', 'No more coffee.'], ['Despacio, por favor.', 'Espero afuera.', 'Ya no hay café.']],
    ['Nos vemos luego.', 'Catch you later.', 'nos VEH-mos LWEH-go', ['Stay here.', 'I need a napkin.', 'That is too sweet.'], ['Quédate aquí.', 'Necesito una servilleta.', 'Está demasiado dulce.']]
], 'casual');

add('cafe_slang', 'french', [
    ['Un petit noir.', 'A small espresso.', 'uhn puh-tee NWAR', ['A big salad.', 'Iced tea only.', 'No coffee.'], ['Une grande salade.', 'Que du thé glacé.', 'Pas de café.']],
    ['Serré, s’il te plaît.', 'Make it strong.', 'seh-RAY sil tuh play', ['Make it weak.', 'No sugar ever.', 'I want soup.'], ['Fais-le léger.', 'Jamais de sucre.', 'Je veux de la soupe.']],
    ['Avec un nuage de lait.', 'With a splash of milk.', 'ah-VEK uhn nwahzh duh LAY', ['Black only.', 'Whipped cream mountain.', 'Just water.'], ['Noir uniquement.', 'Montagne de chantilly.', "Juste de l'eau."]],
    ['C’est cadeau.', "It's on the house.", 'say kah-DOH', ['Pay double.', 'You owe me.', 'The card declined.'], ['Paye le double.', 'Tu me dois.', 'La carte est refusée.']],
    ['Je te fais ça.', "I'll sort that.", 'zhuh tuh fay SAH', ['I refuse.', 'Come back Monday.', 'We are closed.'], ['Je refuse.', 'Reviens lundi.', 'On est fermés.']],
    ['T’inquiète.', "Don't worry.", 'tan-KYET', ['Panic now.', 'Call the police.', 'I am leaving.'], ['Panique maintenant.', 'Appelez la police.', 'Je m’en vais.']],
    ['Un allongé.', 'A long coffee / Americano.', 'uhn ah-lon-ZHAY', ['A croissant only.', 'No drinks.', 'Sparkling water.'], ['Un croissant seulement.', 'Pas de boissons.', 'De l’eau pétillante.']],
    ['Sans sucre.', 'No sugar.', 'sahn SOO-kruh', ['Extra sugar.', 'Only honey.', 'I want cake.'], ['Plus de sucre.', 'Que du miel.', 'Je veux un gâteau.']],
    ['À emporter.', 'To go.', 'ah ahm-por-TAY', ['For here only.', 'Sit down.', 'I live here.'], ['Sur place seulement.', 'Assieds-toi.', "J'habite ici."]],
    ['Sur place.', 'For here.', 'sur PLAHSS', ['To go.', 'Deliver it.', 'Throw it out.'], ['À emporter.', 'Livrez-le.', 'Jetez-le.']]
], 'slang');

add('cafe_slang', 'spanish', [
    ['Un cortado.', 'An espresso with a splash of milk.', 'uhn kor-TAH-doh', ['A huge salad.', 'Iced tea only.', 'No coffee.'], ['Una ensalada enorme.', 'Solo té helado.', 'Sin café.']],
    ['Bien cargado.', 'Make it strong.', 'byehn kar-GAH-doh', ['Make it weak.', 'No sugar ever.', 'I want soup.'], ['Hazlo suave.', 'Nunca azúcar.', 'Quiero sopa.']],
    ['Con un chorrito de leche.', 'With a splash of milk.', 'kon uhn cho-REE-toh deh LEH-cheh', ['Black only.', 'Whipped cream mountain.', 'Just water.'], ['Solo negro.', 'Montaña de crema.', 'Solo agua.']],
    ['Va por la casa.', "It's on the house.", 'bah por lah KAH-sah', ['Pay double.', 'You owe me.', 'The card declined.'], ['Paga el doble.', 'Me debes.', 'La tarjeta fue rechazada.']],
    ['Te lo armo.', "I'll put that together.", 'teh lo AR-moh', ['I refuse.', 'Come back Monday.', 'We are closed.'], ['Me niego.', 'Vuelve el lunes.', 'Estamos cerrados.']],
    ['No te preocupes.', "Don't worry.", 'no teh preh-oh-KOO-pes', ['Panic now.', 'Call the police.', 'I am leaving.'], ['Entra en pánico.', 'Llama a la policía.', 'Me voy.']],
    ['Un americano.', 'An Americano.', 'uhn ah-meh-ree-KAH-noh', ['A croissant only.', 'No drinks.', 'Sparkling water.'], ['Solo un croissant.', 'Sin bebidas.', 'Agua con gas.']],
    ['Sin azúcar.', 'No sugar.', 'seen ah-THOO-kar', ['Extra sugar.', 'Only honey.', 'I want cake.'], ['Más azúcar.', 'Solo miel.', 'Quiero pastel.']],
    ['Para llevar.', 'To go.', 'PAH-rah yeh-VAR', ['For here only.', 'Sit down.', 'I live here.'], ['Solo para aquí.', 'Siéntate.', 'Vivo aquí.']],
    ['Para aquí.', 'For here.', 'PAH-rah ah-KEE', ['To go.', 'Deliver it.', 'Throw it out.'], ['Para llevar.', 'Entrégalo.', 'Tíralo.']]
], 'slang');

add('small_talk', 'french', [
    ['Il fait beau, hein ?', 'Nice out, huh?', 'eel fay BOH an', ['It is snowing inside.', 'I need a lawyer.', 'Stop talking.'], ['Il neige dedans.', "J'ai besoin d'un avocat.", 'Arrête de parler.']],
    ['T’as l’air crevé.', 'You look wiped.', 'tah lair kruh-VAY', ['You look famous.', 'Sit on the cake.', 'I am a doctor.'], ['Tu as l’air célèbre.', 'Assieds-toi sur le gâteau.', 'Je suis médecin.']],
    ['Ça boume au boulot ?', 'Work treating you okay?', 'sah boom oh boo-LOH', ['Fire everyone.', 'I quit yesterday.', 'No jobs here.'], ['Licencie tout le monde.', "J'ai démissionné hier.", 'Pas de travail ici.']],
    ['Encore la pluie.', 'Rain again.', 'ahn-KOR lah plwee', ['The sun exploded.', 'Bring an umbrella cake.', 'I hate coffee.'], ['Le soleil a explosé.', 'Apporte un gâteau parapluie.', 'Je déteste le café.']],
    ['T’es d’où, toi ?', 'Where you from?', 'tay doo TWAH', ['Leave the country.', 'I am from the moon.', 'No names.'], ['Quitte le pays.', 'Je viens de la lune.', 'Pas de noms.']],
    ['Le weekend a été long.', 'The weekend ran long.', 'luh week-END ah ay-tay LON', ['Monday never comes.', 'I slept in the oven.', 'Close forever.'], ['Lundi n’arrive jamais.', "J'ai dormi dans le four.", 'Fermez pour toujours.']],
    ['Tu suis le foot ?', 'You follow soccer?', 'too swee luh FOOT', ['I only bake.', 'Sports are illegal.', 'Turn off the radio.'], ['Je ne fais que pâtisser.', 'Le sport est interdit.', 'Éteins la radio.']],
    ['Fait chaud ici.', 'It’s warm in here.', 'fay SHO ee-see', ['Open the freezer.', 'I am a penguin.', 'Wear a coat.'], ['Ouvre le congélateur.', 'Je suis un pingouin.', 'Mets un manteau.']],
    ['T’as vu le match ?', 'Did you see the game?', 'tah vew luh MATCH', ['I do not watch.', 'The TV melted.', 'Only opera.'], ['Je ne regarde pas.', 'La télé a fondu.', "Que de l'opéra."]],
    ['On se croise souvent.', 'We keep bumping into each other.', 'ohn suh krwahz soo-VAHN', ['Never come back.', 'I do not know you.', 'This is a bank.'], ['Ne reviens jamais.', 'Je ne te connais pas.', "C'est une banque."]]
], 'casual');

add('small_talk', 'spanish', [
    ['Hace buen día, ¿no?', 'Nice day, right?', 'AH-seh bwen DEE-ah no', ['It is snowing inside.', 'I need a lawyer.', 'Stop talking.'], ['Nieva adentro.', 'Necesito un abogado.', 'Deja de hablar.']],
    ['Te ves hecho polvo.', 'You look wiped.', 'teh ves EH-choh POL-vo', ['You look famous.', 'Sit on the cake.', 'I am a doctor.'], ['Pareces famoso.', 'Siéntate en el pastel.', 'Soy médico.']],
    ['¿Cómo va el jale?', 'How’s work treating you?', 'KOH-moh bah el HAH-leh', ['Fire everyone.', 'I quit yesterday.', 'No jobs here.'], ['Despide a todos.', 'Renuncié ayer.', 'Aquí no hay trabajo.']],
    ['Otra vez la lluvia.', 'Rain again.', 'OH-trah ves lah YOO-vyah', ['The sun exploded.', 'Bring an umbrella cake.', 'I hate coffee.'], ['El sol explotó.', 'Trae un pastel paraguas.', 'Odio el café.']],
    ['¿De dónde eres?', 'Where are you from?', 'deh DON-deh EH-res', ['Leave the country.', 'I am from the moon.', 'No names.'], ['Deja el país.', 'Vengo de la luna.', 'Sin nombres.']],
    ['El fin fue eterno.', 'The weekend ran long.', 'el feen fweh eh-TER-noh', ['Monday never comes.', 'I slept in the oven.', 'Close forever.'], ['El lunes no llega.', 'Dormí en el horno.', 'Cierren para siempre.']],
    ['¿Ves el fútbol?', 'You watch soccer?', 'ves el FOOT-bol', ['I only bake.', 'Sports are illegal.', 'Turn off the radio.'], ['Solo horneo.', 'El deporte es ilegal.', 'Apaga la radio.']],
    ['Hace calor aquí.', 'It’s warm in here.', 'AH-seh kah-LOR ah-KEE', ['Open the freezer.', 'I am a penguin.', 'Wear a coat.'], ['Abre el congelador.', 'Soy un pingüino.', 'Ponte un abrigo.']],
    ['¿Viste el partido?', 'Did you see the game?', 'VEES-teh el par-TEE-doh', ['I do not watch.', 'The TV melted.', 'Only opera.'], ['No veo eso.', 'La tele se derritió.', 'Solo ópera.']],
    ['Siempre nos encontramos.', 'We keep bumping into each other.', 'SYEM-preh nos en-kon-TRAH-mos', ['Never come back.', 'I do not know you.', 'This is a bank.'], ['No vuelvas nunca.', 'No te conozco.', 'Esto es un banco.']]
], 'casual');

add('farewells', 'french', [
    ['Je vous souhaite une excellente soirée.', 'I wish you an excellent evening.', 'zhuh voo soo-HET ewn ek-seh-LAHNT swah-RAY', ['Get out now.', 'Pay extra.', 'We are angry.'], ['Sortez maintenant.', 'Payez plus.', 'Nous sommes en colère.']],
    ['Au plaisir de vous revoir.', 'Pleasure to see you again.', 'oh play-ZEER duh voo ruh-VWAR', ['Do not return.', 'I forgot you.', 'Leave the bag.'], ['Ne revenez pas.', 'Je vous ai oublié.', 'Laissez le sac.']],
    ['Prenez soin de vous.', 'Take care of yourself.', 'pruh-NAY swan duh VOO', ['Ignore your health.', 'Run into traffic.', 'Skip dinner.'], ['Ignorez votre santé.', 'Courez dans la rue.', 'Sautez le dîner.']],
    ['À très bientôt.', 'See you very soon.', 'ah treh byehn-TOH', ['In ten years.', 'Never again.', 'Yesterday.'], ['Dans dix ans.', 'Plus jamais.', 'Hier.']],
    ['Bonne continuation.', 'All the best going forward.', 'bun kon-tee-nwa-SYON', ['Stop everything.', 'Fail on purpose.', 'Go backwards.'], ['Arrêtez tout.', 'Échouez exprès.', 'Reculez.']],
    ['Faites un bon trajet.', 'Have a good trip home.', 'fet uhn bon trah-ZHAY', ['Get lost.', 'Walk into a wall.', 'Stay on the roof.'], ['Perdez-vous.', 'Marchez dans un mur.', 'Restez sur le toit.']],
    ['Merci de votre visite.', 'Thank you for visiting.', 'mehr-SEE duh vo-truh vee-ZEET', ['You were a problem.', 'Never come.', 'We are closed forever.'], ['Vous étiez un problème.', 'Ne venez jamais.', 'Fermé pour toujours.']],
    ['Passez une belle journée.', 'Have a lovely day.', 'pah-SAY ewn bel zhoor-NAY', ['Have a terrible day.', 'Go to sleep now.', 'Stay angry.'], ['Passez une horrible journée.', 'Dormez maintenant.', 'Restez en colère.']],
    ['Nous espérons vous revoir.', 'We hope to see you again.', 'noo zes-pay-RON voo ruh-VWAR', ['Please leave forever.', 'Forget this café.', 'No second chances.'], ['Partez pour toujours.', 'Oubliez ce café.', 'Pas de seconde chance.']],
    ['À la prochaine.', 'Until next time.', 'ah lah pro-SHEN', ['This was the last time.', 'I am moving.', 'The shop burned.'], ["C'était la dernière fois.", 'Je déménage.', 'La boutique a brûlé.']]
], 'formal');

add('farewells', 'spanish', [
    ['Le deseo una excelente noche.', 'I wish you an excellent evening.', 'leh deh-SEH-oh OO-nah ek-seh-LEN-teh NOH-cheh', ['Get out now.', 'Pay extra.', 'We are angry.'], ['Salga ahora.', 'Pague de más.', 'Estamos enojados.']],
    ['Un placer volver a verle.', 'Pleasure to see you again.', 'oon plah-SEHR vol-VEHR ah VEHR-leh', ['Do not return.', 'I forgot you.', 'Leave the bag.'], ['No regrese.', 'Lo olvidé.', 'Deje la bolsa.']],
    ['Cuídese mucho.', 'Take good care.', 'KWEE-deh-seh MOO-choh', ['Ignore your health.', 'Run into traffic.', 'Skip dinner.'], ['Ignore su salud.', 'Corra al tráfico.', 'Sáltese la cena.']],
    ['Hasta muy pronto.', 'See you very soon.', 'AHS-tah mwee PRON-toh', ['In ten years.', 'Never again.', 'Yesterday.'], ['En diez años.', 'Nunca más.', 'Ayer.']],
    ['Que le vaya muy bien.', 'All the best going forward.', 'keh leh VAH-yah mwee byehn', ['Stop everything.', 'Fail on purpose.', 'Go backwards.'], ['Pare todo.', 'Fracase a propósito.', 'Vaya hacia atrás.']],
    ['Que tenga buen camino.', 'Have a good trip home.', 'keh TEN-gah bwen kah-MEE-noh', ['Get lost.', 'Walk into a wall.', 'Stay on the roof.'], ['Piérdase.', 'Camine contra un muro.', 'Quédese en el techo.']],
    ['Gracias por su visita.', 'Thank you for visiting.', 'GRAH-syahs por soo vee-SEE-tah', ['You were a problem.', 'Never come.', 'We are closed forever.'], ['Usted fue un problema.', 'No venga nunca.', 'Cerrado para siempre.']],
    ['Que tenga un lindo día.', 'Have a lovely day.', 'keh TEN-gah oon LEEN-doh DEE-ah', ['Have a terrible day.', 'Go to sleep now.', 'Stay angry.'], ['Que tenga un día horrible.', 'Duerma ahora.', 'Quédese enojado.']],
    ['Esperamos verle de nuevo.', 'We hope to see you again.', 'es-peh-RAH-mos VEHR-leh deh NWEH-vo', ['Please leave forever.', 'Forget this café.', 'No second chances.'], ['Váyase para siempre.', 'Olvide este café.', 'Sin segunda oportunidad.']],
    ['Hasta la próxima.', 'Until next time.', 'AHS-tah lah PROK-see-mah', ['This was the last time.', 'I am moving.', 'The shop burned.'], ['Esta fue la última vez.', 'Me mudo.', 'La tienda se quemó.']]
], 'formal');

add('greetings_formal', 'french', [
    ['Enchanté de vous accueillir.', 'Delighted to welcome you.', 'ahn-shahn-TAY duh voo zah-kuh-YEER', ['Go away.', 'We are full.', 'No customers today.'], ['Allez-vous-en.', 'Nous sommes complets.', 'Pas de clients aujourd’hui.']],
    ['Puis-je prendre votre manteau ?', 'May I take your coat?', 'pwee zhuh prahn-druh vo-truh mahn-TOH', ['Throw your coat.', 'Keep standing.', 'Leave it outside.'], ['Jetez votre manteau.', 'Restez debout.', 'Laissez-le dehors.']],
    ['Installez-vous, je vous prie.', 'Please have a seat.', 'an-stal-lay VOO zhuh voo PREE', ['Stand in the kitchen.', 'Sit on the floor.', 'Wait in the rain.'], ['Restez dans la cuisine.', 'Asseyez-vous par terre.', 'Attendez sous la pluie.']],
    ['Avez-vous une réservation ?', 'Do you have a reservation?', 'ah-vay VOO ewn ray-zehr-vah-SYON', ['Are you lost?', 'Do you cook?', 'Is this a bank?'], ['Êtes-vous perdu ?', 'Cuisinez-vous ?', "Est-ce une banque ?"]],
    ['Je m’occupe de vous tout de suite.', 'I will be with you right away.', 'zhuh mok-EWP duh voo too dweet', ['Wait two hours.', 'Serve yourself.', 'We forgot you.'], ['Attendez deux heures.', 'Servez-vous.', 'Nous vous avons oublié.']],
    ['Soyez le bienvenu.', 'You are most welcome.', 'swah-YAY luh byehn-vuh-NEW', ['You are banned.', 'Wrong café.', 'Come tomorrow.'], ['Vous êtes interdit.', 'Mauvais café.', 'Venez demain.']],
    ['Permettez-moi de vous installer.', 'Allow me to seat you.', 'pehr-meh-TAY mwah duh voo zan-stal-LAY', ['Find a chair yourself.', 'Stand by the door.', 'Leave your friends.'], ['Trouvez une chaise.', 'Restez près de la porte.', 'Laissez vos amis.']],
    ['Un instant, s’il vous plaît.', 'One moment, please.', 'uhn an-STAN sil voo play', ['Never.', 'Yesterday.', 'Shout louder.'], ['Jamais.', 'Hier.', 'Criez plus fort.']],
    ['Nous sommes ravis de vous servir.', 'We are delighted to serve you.', 'noo som rah-VEE duh voo sehr-VEER', ['We refuse to serve you.', 'The kitchen quit.', 'Go next door.'], ['Nous refusons de vous servir.', 'La cuisine a démissionné.', "Allez à côté."]],
    ['Après vous, je vous en prie.', 'After you, please.', 'ah-preh VOO zhuh voo zahn PREE', ['I go first.', 'Push ahead.', 'Block the door.'], ['Je passe devant.', 'Poussez.', 'Bloquez la porte.']]
], 'formal');

add('greetings_formal', 'spanish', [
    ['Encantado de recibirle.', 'Delighted to welcome you.', 'en-kahn-TAH-doh deh reh-see-BEER-leh', ['Go away.', 'We are full.', 'No customers today.'], ['Váyase.', 'Estamos llenos.', 'Hoy no hay clientes.']],
    ['¿Me permite su abrigo?', 'May I take your coat?', 'meh pehr-MEE-teh soo ah-BREE-go', ['Throw your coat.', 'Keep standing.', 'Leave it outside.'], ['Tire el abrigo.', 'Siga de pie.', 'Déjelo afuera.']],
    ['Tome asiento, por favor.', 'Please have a seat.', 'TOH-meh ah-SYEN-toh por fah-VOR', ['Stand in the kitchen.', 'Sit on the floor.', 'Wait in the rain.'], ['Quédese en la cocina.', 'Siéntese en el piso.', 'Espere bajo la lluvia.']],
    ['¿Tiene una reserva?', 'Do you have a reservation?', 'TYEH-neh OO-nah reh-SEHR-vah', ['Are you lost?', 'Do you cook?', 'Is this a bank?'], ['¿Está perdido?', '¿Cocina usted?', '¿Esto es un banco?']],
    ['Lo atiendo enseguida.', 'I will be with you right away.', 'lo ah-TYEN-doh en-seh-GEE-dah', ['Wait two hours.', 'Serve yourself.', 'We forgot you.'], ['Espere dos horas.', 'Sírvase usted.', 'Lo olvidamos.']],
    ['Sea usted bienvenido.', 'You are most welcome.', 'SEH-ah oos-TED byehn-veh-NEE-doh', ['You are banned.', 'Wrong café.', 'Come tomorrow.'], ['Está prohibido.', 'Café equivocado.', 'Venga mañana.']],
    ['Permítame sentarlo.', 'Allow me to seat you.', 'pehr-MEE-tah-meh sen-TAR-lo', ['Find a chair yourself.', 'Stand by the door.', 'Leave your friends.'], ['Busque una silla.', 'Quédese en la puerta.', 'Deje a sus amigos.']],
    ['Un momento, por favor.', 'One moment, please.', 'oon moh-MEN-toh por fah-VOR', ['Never.', 'Yesterday.', 'Shout louder.'], ['Nunca.', 'Ayer.', 'Grite más fuerte.']],
    ['Es un gusto servirle.', 'We are delighted to serve you.', 'es oon GOOS-toh sehr-VEER-leh', ['We refuse to serve you.', 'The kitchen quit.', 'Go next door.'], ['Nos negamos a servirle.', 'La cocina renunció.', 'Vaya al lado.']],
    ['Después de usted.', 'After you, please.', 'des-PWES deh oos-TED', ['I go first.', 'Push ahead.', 'Block the door.'], ['Yo primero.', 'Empuje.', 'Bloquee la puerta.']]
], 'formal');

add('taking_orders', 'french', [
    ['Souhaitez-vous commencer par une entrée ?', 'Would you like to start with an appetizer?', 'soo-eh-TAY voo ko-mahn-SAY par ewn ahn-TRAY', ['Skip all food.', 'Only dessert now.', 'We have no plates.'], ['Sautez tout.', 'Que le dessert.', "Nous n'avons pas d'assiettes."]],
    ['Le gâteau du jour vous tente ?', 'Does today’s cake tempt you?', 'luh gah-TOH du ZHOOR voo TAHNT', ['We baked nothing.', 'Eat the napkin.', 'Cakes are illegal.'], ["Nous n'avons rien cuit.", 'Mangez la serviette.', 'Les gâteaux sont interdits.']],
    ['Préférez-vous le chocolat ou la vanille ?', 'Do you prefer chocolate or vanilla?', 'pray-fay-RAY voo luh sho-ko-LAH oo lah vah-NEE', ['Neither, only salt.', 'I want soup.', 'No flavors.'], ['Ni l’un ni l’autre, que du sel.', 'Je veux de la soupe.', 'Pas de parfums.']],
    ['Puis-je vous conseiller le mille-feuille ?', 'May I recommend the mille-feuille?', 'pwee zhuh voo kon-seh-YAY luh meel-FOY', ['Do not recommend anything.', 'Order for me blindly.', 'We ran out of pastry.'], ['Ne conseillez rien.', 'Commandez pour moi au hasard.', 'Plus de pâtisserie.']],
    ['Une part ou une pièce entière ?', 'A slice or a whole pastry?', 'ewn PAR oo ewn pyess ahn-TYAIR', ['Eat the box.', 'Three ovens.', 'No pastry left.'], ['Mangez la boîte.', 'Trois fours.', 'Plus de pâtisserie.']],
    ['Le café accompagnera le dessert ?', 'Shall coffee accompany dessert?', 'luh kah-FEH ah-kom-pahn-yuh-RAH luh deh-SAIR', ['Coffee is banned.', 'Dessert is soup.', 'Drink the glaze.'], ['Le café est interdit.', 'Le dessert est une soupe.', 'Buvez le glaçage.']],
    ['Avez-vous des allergies ?', 'Do you have any allergies?', 'ah-vay VOO day zah-lehr-ZHEE', ['I eat everything including chairs.', 'Allergies are rude.', 'Ignore the nuts.'], ['Je mange même les chaises.', 'Les allergies sont impolies.', 'Ignorez les noix.']],
    ['Je répète la commande.', 'I will repeat the order.', 'zhuh ray-PET lah ko-MAHND', ['I guess randomly.', 'Forget the order.', 'Shout it once.'], ['Je devine au hasard.', 'Oubliez la commande.', 'Criez une fois.']],
    ['Ce gâteau demande quelques minutes.', 'This cake needs a few minutes.', 'suh gah-TOH duh-MAHND kel-kuh mee-NOOT', ['It is already stale.', 'Eat it raw.', 'It will never be ready.'], ["Il est déjà rassis.", 'Mangez-le cru.', 'Il ne sera jamais prêt.']],
    ['Souhaitez-vous l’addition maintenant ?', 'Would you like the bill now?', 'soo-eh-TAY voo lad-dee-SYON ment-NAHN', ['Never pay.', 'Pay next year.', 'The meal is free forever.'], ['Ne payez jamais.', "Payez l'année prochaine.", 'Le repas est gratuit pour toujours.']]
], 'formal');

add('taking_orders', 'spanish', [
    ['¿Desea empezar con una entrada?', 'Would you like to start with an appetizer?', 'deh-SEH-ah em-peh-ZAR kon OO-nah en-TRAH-dah', ['Skip all food.', 'Only dessert now.', 'We have no plates.'], ['Sáltese toda la comida.', 'Solo postre ahora.', 'No hay platos.']],
    ['¿Le tienta el pastel del día?', 'Does today’s cake tempt you?', 'leh TYEN-tah el pas-TEL del DEE-ah', ['We baked nothing.', 'Eat the napkin.', 'Cakes are illegal.'], ['No horneamos nada.', 'Coma la servilleta.', 'Los pasteles son ilegales.']],
    ['¿Prefiere chocolate o vainilla?', 'Do you prefer chocolate or vanilla?', 'preh-FYEH-reh cho-ko-LAH-teh oh vai-NEE-yah', ['Neither, only salt.', 'I want soup.', 'No flavors.'], ['Ninguno, solo sal.', 'Quiero sopa.', 'Sin sabores.']],
    ['¿Le recomiendo el milhojas?', 'May I recommend the milhojas?', 'leh reh-ko-MYEN-doh el meel-OH-has', ['Do not recommend anything.', 'Order for me blindly.', 'We ran out of pastry.'], ['No recomiende nada.', 'Pida al azar.', 'Se acabó la masa.']],
    ['¿Una porción o la pieza entera?', 'A slice or a whole pastry?', 'OO-nah por-SYON oh lah PYEH-sah en-TEH-rah', ['Eat the box.', 'Three ovens.', 'No pastry left.'], ['Coma la caja.', 'Tres hornos.', 'Ya no hay pastel.']],
    ['¿El café acompaña el postre?', 'Shall coffee accompany dessert?', 'el kah-FEH ah-kom-PAH-nyah el POS-treh', ['Coffee is banned.', 'Dessert is soup.', 'Drink the glaze.'], ['El café está prohibido.', 'El postre es sopa.', 'Beba el glaseado.']],
    ['¿Tiene alguna alergia?', 'Do you have any allergies?', 'TYEH-neh al-GOO-nah ah-LEHR-hyah', ['I eat everything including chairs.', 'Allergies are rude.', 'Ignore the nuts.'], ['Como hasta las sillas.', 'Las alergias son groseras.', 'Ignore los frutos secos.']],
    ['Repito el pedido.', 'I will repeat the order.', 'reh-PEE-toh el peh-DEE-doh', ['I guess randomly.', 'Forget the order.', 'Shout it once.'], ['Adivino al azar.', 'Olvide el pedido.', 'Grite una vez.']],
    ['Este pastel necesita unos minutos.', 'This cake needs a few minutes.', 'ES-teh pas-TEL neh-seh-SEE-tah OO-nos mee-NOO-tos', ['It is already stale.', 'Eat it raw.', 'It will never be ready.'], ['Ya está pasado.', 'Cómase lo crudo.', 'Nunca estará listo.']],
    ['¿Desea la cuenta ahora?', 'Would you like the bill now?', 'deh-SEH-ah lah KWEN-tah ah-OH-rah', ['Never pay.', 'Pay next year.', 'The meal is free forever.'], ['Nunca pague.', 'Pague el año que viene.', 'La comida es gratis para siempre.']]
], 'formal');

add('apologies_excuses', 'french', [
    ['Je suis sincèrement désolé pour l’attente.', 'I am truly sorry for the wait.', 'zhuh swee san-SEHR-mahn day-zo-LAY poor lah-TAHNT', ['Wait longer.', 'That was your fault.', 'We do not care.'], ['Attendez plus longtemps.', "C'était de votre faute.", "On s'en fiche."]],
    ['Veuillez m’excuser, j’arrive.', 'Please excuse me, I am coming.', 'vuh-YAY meks-kew-ZAY zhah-REEV', ['I am never coming.', 'Serve yourself badly.', 'Leave now.'], ['Je ne viens jamais.', 'Servez-vous mal.', 'Partez maintenant.']],
    ['C’est entièrement ma faute.', 'That is entirely my fault.', 'set ahn-tyair-MAHN mah FOT', ['It is your fault.', 'Blame the chair.', 'No one is sorry.'], ["C'est votre faute.", 'Accusez la chaise.', "Personne n'est désolé."]],
    ['Permettez-moi de recommencer.', 'Allow me to start over.', 'pehr-meh-TAY mwah duh ruh-ko-mahn-SAY', ['We will not fix it.', 'Eat it anyway.', 'No second try.'], ['Nous ne corrigerons pas.', 'Mangez-le quand même.', 'Pas de second essai.']],
    ['Je vais régler cela immédiatement.', 'I will fix that immediately.', 'zhuh vay ray-GLAY suh-lah ee-may-dyat-MAHN', ['Ignore the problem.', 'Come next week.', 'It cannot be fixed.'], ['Ignorez le problème.', 'Venez la semaine prochaine.', 'On ne peut pas le réparer.']],
    ['Pardon de vous avoir interrompu.', 'Sorry for interrupting you.', 'par-DON duh voo zah-vwar an-teh-rom-PEW', ['Keep interrupting.', 'Talk louder.', 'I heard nothing.'], ['Continuez à couper la parole.', 'Parlez plus fort.', "Je n'ai rien entendu."]],
    ['Nous avons fait une erreur de commande.', 'We made a mistake on the order.', 'noo zah-VON fay ewn eh-RUHR duh ko-MAHND', ['The order was perfect.', 'You ordered wrong.', 'No mistakes here.'], ['La commande était parfaite.', 'Vous avez mal commandé.', 'Aucune erreur ici.']],
    ['Je vous prie d’accepter nos excuses.', 'Please accept our apologies.', 'zhuh voo PREE dak-sep-TAY noz eks-KEWZ', ['We will not apologize.', 'Laugh at the guest.', 'No excuses exist.'], ['Nous ne nous excuserons pas.', 'Riez du client.', "Il n'y a pas d'excuses."]],
    ['Le four a pris du retard.', 'The oven ran behind.', 'luh FOOR ah pree dew ruh-TAR', ['The oven is imaginary.', 'Food cooks instantly.', 'We do not bake.'], ['Le four est imaginaire.', 'La nourriture cuit instantanément.', 'Nous ne cuisons pas.']],
    ['Ce n’est pas à la hauteur de nos standards.', 'That is not up to our standards.', 'suh nay pah ah lah oh-TUHR duh no STAN-dar', ['That was our best work.', 'Standards are a myth.', 'Guests should lower theirs.'], ["C'était notre meilleur travail.", 'Les standards sont un mythe.', 'Les clients devraient baisser les leurs.']]
], 'formal');

add('apologies_excuses', 'spanish', [
    ['Lamento sinceramente la espera.', 'I am truly sorry for the wait.', 'lah-MEN-toh sin-seh-rah-MEN-teh lah es-PEH-rah', ['Wait longer.', 'That was your fault.', 'We do not care.'], ['Espere más.', 'Fue su culpa.', 'No nos importa.']],
    ['Discúlpeme, ya voy.', 'Please excuse me, I am coming.', 'dees-KOOL-peh-meh yah BOY', ['I am never coming.', 'Serve yourself badly.', 'Leave now.'], ['Nunca voy.', 'Sírvase mal.', 'Váyase ahora.']],
    ['Es enteramente mi culpa.', 'That is entirely my fault.', 'es en-teh-rah-MEN-teh mee KOOL-pah', ['It is your fault.', 'Blame the chair.', 'No one is sorry.'], ['Es su culpa.', 'Culpe a la silla.', 'Nadie se disculpa.']],
    ['Permítame empezar de nuevo.', 'Allow me to start over.', 'pehr-MEE-tah-meh em-peh-ZAR deh NWEH-vo', ['We will not fix it.', 'Eat it anyway.', 'No second try.'], ['No lo arreglaremos.', 'Cómase lo igual.', 'Sin segundo intento.']],
    ['Lo soluciono de inmediato.', 'I will fix that immediately.', 'lo so-loo-SYOH-no deh in-meh-DYAH-toh', ['Ignore the problem.', 'Come next week.', 'It cannot be fixed.'], ['Ignore el problema.', 'Venga la semana que viene.', 'No se puede arreglar.']],
    ['Perdón por interrumpirle.', 'Sorry for interrupting you.', 'pehr-DON por in-teh-room-PEER-leh', ['Keep interrupting.', 'Talk louder.', 'I heard nothing.'], ['Siga interrumpiendo.', 'Hable más fuerte.', 'No oí nada.']],
    ['Cometimos un error en el pedido.', 'We made a mistake on the order.', 'ko-MEH-tee-mos oon eh-ROHR en el peh-DEE-doh', ['The order was perfect.', 'You ordered wrong.', 'No mistakes here.'], ['El pedido era perfecto.', 'Usted pidió mal.', 'Aquí no hay errores.']],
    ['Le ruego acepte nuestras disculpas.', 'Please accept our apologies.', 'leh RWEH-go ak-SEP-teh NWEHS-tras dees-KOOL-pas', ['We will not apologize.', 'Laugh at the guest.', 'No excuses exist.'], ['No nos disculpamos.', 'Ríase del cliente.', 'No hay disculpas.']],
    ['El horno se atrasó.', 'The oven ran behind.', 'el OR-no seh ah-trah-SOH', ['The oven is imaginary.', 'Food cooks instantly.', 'We do not bake.'], ['El horno es imaginario.', 'La comida se cocina al instante.', 'No horneamos.']],
    ['Eso no está a la altura de nuestro estándar.', 'That is not up to our standards.', 'EH-so no es-TAH ah lah al-TOO-rah deh NWEHS-tro es-TAHN-dar', ['That was our best work.', 'Standards are a myth.', 'Guests should lower theirs.'], ['Ese fue nuestro mejor trabajo.', 'Los estándares son un mito.', 'Los clientes deberían bajar los suyos.']]
], 'formal');

add('food_praise', 'french', [
    ['C’est un délice, vraiment.', 'This is truly a delight.', 'set uhn day-LEESS vray-MAHN', ['This tastes like cardboard.', 'I cannot eat this.', 'Send it back.'], ["Ça goûte le carton.", 'Je ne peux pas manger ça.', 'Renvoyez-le.']],
    ['La crème est un nuage.', 'The cream is a cloud.', 'lah KREM et uhn nwahzh', ['The cream is sour.', 'There is no cream.', 'It is burnt milk.'], ['La crème est aigre.', "Il n'y a pas de crème.", "C'est du lait brûlé."]],
    ['Je fondrais pour cette tarte.', 'I would melt for this tart.', 'zhuh fon-DRAY poor set TART', ['I would skip dessert.', 'The tart is empty.', 'Give me salad.'], ['Je sauterais le dessert.', 'La tarte est vide.', 'Donnez-moi une salade.']],
    ['Chaque couche est une déclaration d’amour.', 'Each layer is a love letter.', 'shahk koosh et ewn day-klah-rah-SYON dah-MOOR', ['Each layer is a mistake.', 'Flatten it.', 'Too many layers.'], ['Chaque couche est une erreur.', 'Aplatissez-la.', 'Trop de couches.']],
    ['Le caramel chante.', 'The caramel sings.', 'luh kah-rah-MEL SHAHNT', ['The caramel is silent and burnt.', 'No caramel here.', 'It tastes like smoke only.'], ['Le caramel est silencieux et brûlé.', 'Pas de caramel ici.', 'Ça goûte seulement la fumée.']],
    ['C’est irrésistible.', 'It is irresistible.', 'set ee-ray-zees-TEE-bluh', ['I can easily resist.', 'Not for me.', 'Give it away.'], ['Je résiste facilement.', 'Pas pour moi.', 'Donnez-le.']],
    ['Une bouchée et je suis perdu.', 'One bite and I am gone.', 'ewn boo-SHAY ay zhuh swee pehr-DEW', ['One bite and I am bored.', 'I will not taste it.', 'Save it for later forever.'], ['Une bouchée et je m’ennuie.', 'Je ne goûterai pas.', 'Gardez-le pour plus tard pour toujours.']],
    ['C’est trop beau pour être mangé… presque.', 'It is too pretty to eat… almost.', 'say troh BO poor etr mahn-ZHAY presk', ['Smash it first.', 'It is ugly.', 'Do not photograph it.'], ['Écrasez-le d’abord.', "C'est laid.", 'Ne le photographiez pas.']],
    ['Le parfum du beurre me transporte.', 'The smell of butter carries me away.', 'luh par-FUHN dew BURR muh trans-PORT', ['It smells like smoke alarm.', 'No butter allowed.', 'Open a window and leave.'], ['Ça sent l’alarme incendie.', 'Beurre interdit.', 'Ouvrez une fenêtre et partez.']],
    ['Encore une part, je vous en supplie.', 'One more slice, I beg you.', 'ahn-KOR ewn PAR zhuh voo zahn sew-PLEE', ['No more ever.', 'I am full of regret only.', 'Take it away.'], ['Plus jamais.', 'Je suis plein de regrets seulement.', 'Emportez-le.']]
], 'casual');

add('food_praise', 'spanish', [
    ['Es un deleite, de verdad.', 'This is truly a delight.', 'es oon deh-LAY-teh deh vehr-DAD', ['This tastes like cardboard.', 'I cannot eat this.', 'Send it back.'], ['Sabe a cartón.', 'No puedo comer esto.', 'Devuélvalo.']],
    ['La crema es una nube.', 'The cream is a cloud.', 'lah KREH-mah es OO-nah NOO-beh', ['The cream is sour.', 'There is no cream.', 'It is burnt milk.'], ['La crema está agria.', 'No hay crema.', 'Es leche quemada.']],
    ['Me derrito por esta tarta.', 'I would melt for this tart.', 'meh deh-RREE-toh por ES-tah TAR-tah', ['I would skip dessert.', 'The tart is empty.', 'Give me salad.'], ['Me salto el postre.', 'La tarta está vacía.', 'Deme ensalada.']],
    ['Cada capa es una carta de amor.', 'Each layer is a love letter.', 'KAH-dah KAH-pah es OO-nah KAR-tah deh ah-MOR', ['Each layer is a mistake.', 'Flatten it.', 'Too many layers.'], ['Cada capa es un error.', 'Aplástela.', 'Demasiadas capas.']],
    ['El caramelo canta.', 'The caramel sings.', 'el kah-rah-MEH-lo KAHN-tah', ['The caramel is silent and burnt.', 'No caramel here.', 'It tastes like smoke only.'], ['El caramelo está callado y quemado.', 'Aquí no hay caramelo.', 'Solo sabe a humo.']],
    ['Es irresistible.', 'It is irresistible.', 'es ee-rreh-sees-TEE-bleh', ['I can easily resist.', 'Not for me.', 'Give it away.'], ['Resisto fácil.', 'No es para mí.', 'Régalo.']],
    ['Un bocado y me pierdo.', 'One bite and I am gone.', 'oon bo-KAH-doh ee meh PYEHR-doh', ['One bite and I am bored.', 'I will not taste it.', 'Save it for later forever.'], ['Un bocado y me aburro.', 'No lo probaré.', 'Guárdelo para siempre.']],
    ['Es demasiado bonito para comerlo… casi.', 'It is too pretty to eat… almost.', 'es deh-mah-SYAH-doh bo-NEE-toh PAH-rah ko-MEHR-lo KAH-see', ['Smash it first.', 'It is ugly.', 'Do not photograph it.'], ['Aplástelo primero.', 'Es feo.', 'No lo fotografíe.']],
    ['El aroma de mantequilla me lleva.', 'The smell of butter carries me away.', 'el ah-ROH-mah deh man-teh-KEE-yah meh YEH-vah', ['It smells like smoke alarm.', 'No butter allowed.', 'Open a window and leave.'], ['Huele a alarma de humo.', 'Mantequilla prohibida.', 'Abra una ventana y váyase.']],
    ['Otra porción, se lo ruego.', 'One more slice, I beg you.', 'OH-trah por-SYON seh lo RWEH-go', ['No more ever.', 'I am full of regret only.', 'Take it away.'], ['Nunca más.', 'Solo estoy lleno de arrepentimiento.', 'Llévoselo.']]
], 'casual');

add('handling_rush', 'french', [
    ['Deux secondes !', 'Two seconds!', 'duh suh-GOND', ['Two hours!', 'Never.', 'I quit.'], ['Deux heures !', 'Jamais.', 'Je démissionne.']],
    ['Je gère, je gère.', "I've got it, I've got it.", 'zhuh ZHAIR zhuh ZHAIR', ['I am drowning.', 'Nobody help.', 'Close the till.'], ['Je coule.', "Que personne n'aide.", 'Fermez la caisse.']],
    ['Derrière toi !', 'Behind you!', 'deh-RYAIR TWAH', ['In front of the oven fire.', 'Stop moving.', 'Dance now.'], ['Devant le feu du four.', "Arrête de bouger.", 'Danse maintenant.']],
    ['C’est chaud, on accélère.', "It's busy, we speed up.", 'say SHO ohn ak-seh-LAIR', ['We nap now.', 'Slow everything.', 'Send guests home.'], ['On fait la sieste.', 'On ralentit tout.', 'Renvoyez les clients.']],
    ['Un à la fois !', 'One at a time!', 'uhn ah lah FWAH', ['Everyone shout together.', 'Ignore the line.', 'Take none.'], ['Tout le monde crie ensemble.', 'Ignorez la file.', "N'en prenez aucun."]],
    ['Le latte d’abord.', 'The latte first.', 'luh LAT dah-BOR', ['The latte never.', 'Burn the milk.', 'Skip drinks.'], ['Le latte jamais.', 'Brûle le lait.', 'Saute les boissons.']],
    ['J’ai trois commandes dans les mains.', 'I have three orders in my hands.', 'zhay trwa ko-MAHND dahn lay MAN', ['I have zero orders.', 'I dropped everything.', 'The printer exploded only.'], ["Je n'ai aucune commande.", "J'ai tout fait tomber.", "L'imprimante a explosé seulement."]],
    ['On respire après.', 'We breathe after.', 'ohn res-PREER ah-PREH', ['Panic forever.', 'Close now.', 'Cry in the walk-in.'], ['Paniquez pour toujours.', 'Fermez maintenant.', 'Pleurez dans la chambre froide.']],
    ['Caisse, s’il te plaît !', 'Till, please!', 'kess sil tuh play', ['Till is on vacation.', 'No money.', 'Pay in cake only.'], ['La caisse est en vacances.', "Pas d'argent.", 'Payez en gâteau seulement.']],
    ['Service !', 'Coming through / service!', 'sehr-VEESS', ['Stop all plates.', 'Drop it.', 'Walk backwards.'], ['Arrêtez toutes les assiettes.', 'Laisse tomber.', 'Marche à reculons.']]
], 'casual');

add('handling_rush', 'spanish', [
    ['¡Dos segundos!', 'Two seconds!', 'dos seh-GOON-dos', ['Two hours!', 'Never.', 'I quit.'], ['¡Dos horas!', 'Nunca.', 'Renuncio.']],
    ['Yo puedo, yo puedo.', "I've got it, I've got it.", 'yo PWEH-doh yo PWEH-doh', ['I am drowning.', 'Nobody help.', 'Close the till.'], ['Me ahogo.', 'Que nadie ayude.', 'Cierra la caja.']],
    ['¡Atrás de ti!', 'Behind you!', 'ah-TRAS deh tee', ['In front of the oven fire.', 'Stop moving.', 'Dance now.'], ['Delante del fuego del horno.', 'No te muevas.', 'Baila ahora.']],
    ['Está pesado, aceleramos.', "It's busy, we speed up.", 'es-TAH peh-SAH-doh ah-seh-leh-RAH-mos', ['We nap now.', 'Slow everything.', 'Send guests home.'], ['Siesta ahora.', 'Todo más lento.', 'Manda a los clientes a casa.']],
    ['¡Uno a la vez!', 'One at a time!', 'OO-noh ah lah ves', ['Everyone shout together.', 'Ignore the line.', 'Take none.'], ['Todos griten juntos.', 'Ignora la fila.', 'No tomes ninguno.']],
    ['El latte primero.', 'The latte first.', 'el LAT pree-MEH-ro', ['The latte never.', 'Burn the milk.', 'Skip drinks.'], ['El latte nunca.', 'Quema la leche.', 'Sáltate las bebidas.']],
    ['Tengo tres pedidos en las manos.', 'I have three orders in my hands.', 'TEN-go tres peh-DEE-dos en las MAH-nos', ['I have zero orders.', 'I dropped everything.', 'The printer exploded only.'], ['No tengo pedidos.', 'Se me cayó todo.', 'La impresora explotó nada más.']],
    ['Respiramos después.', 'We breathe after.', 'res-pee-RAH-mos des-PWES', ['Panic forever.', 'Close now.', 'Cry in the walk-in.'], ['Pánico para siempre.', 'Cierra ahora.', 'Llora en la cámara.']],
    ['¡Caja, porfa!', 'Till, please!', 'KAH-hah POR-fah', ['Till is on vacation.', 'No money.', 'Pay in cake only.'], ['La caja está de vacaciones.', 'Sin dinero.', 'Paguen solo en pastel.']],
    ['¡Servicio!', 'Coming through / service!', 'sehr-VEE-syoh', ['Stop all plates.', 'Drop it.', 'Walk backwards.'], ['Paren todos los platos.', 'Suéltalo.', 'Camina hacia atrás.']]
], 'casual');

add('sweet_talk', 'french', [
    ['Vous illuminez le comptoir.', 'You light up the counter.', 'voo zee-lew-mee-NAY luh kom-TWAR', ['You dim the lights.', 'Leave immediately.', 'I do not see you.'], ['Vous éteignez les lumières.', 'Partez tout de suite.', 'Je ne vous vois pas.']],
    ['Ce sourire mérite un éclair.', 'That smile deserves an éclair.', 'suh soo-REER may-REET uhn ay-KLAIR', ['That frown deserves nothing.', 'No pastry for you.', 'Wipe that smile.'], ['Cette grimace ne mérite rien.', 'Pas de pâtisserie pour vous.', 'Effacez ce sourire.']],
    ['Restez un peu plus longtemps.', 'Stay a little longer.', 'res-TAY uhn puh plew lon-TAHN', ['Leave now.', 'Never sit.', 'We close in one second.'], ['Partez maintenant.', 'Ne vous asseyez jamais.', 'On ferme dans une seconde.']],
    ['Vous avez bon goût.', 'You have excellent taste.', 'voo zah-VAY bon GOO', ['Your taste is terrible.', 'Order randomly.', 'I choose for you badly.'], ['Vous avez mauvais goût.', 'Commandez au hasard.', 'Je choisis mal pour vous.']],
    ['Un compliment avec le café.', 'A compliment with the coffee.', 'uhn kom-plee-MAHN ah-VEK luh kah-FEH', ['An insult with the coffee.', 'No talking.', 'Only receipts.'], ['Une insulte avec le café.', 'Pas de conversation.', 'Que des reçus.']],
    ['Vous rendez la salle plus douce.', 'You make the room softer.', 'voo rahn-DAY lah SAL plew DOOSS', ['You make the room colder.', 'Leave the room.', 'Turn off charm.'], ['Vous refroidissez la salle.', 'Quittez la salle.', 'Éteignez le charme.']],
    ['Gardez la monnaie, et ce sourire.', 'Keep the change, and that smile.', 'gar-DAY lah moh-NAY ay suh soo-REER', ['Give me every coin.', 'No smiling allowed.', 'Pay extra for frowning.'], ['Rendez chaque pièce.', 'Sourire interdit.', 'Payez plus pour froncer les sourcils.']],
    ['On devrait vous mettre au menu.', 'We should put you on the menu.', 'ohn duh-VRAY voo METR oh muh-NEW', ['You are banned from the menu.', 'Menus are illegal.', 'Order nothing.'], ['Vous êtes banni du menu.', 'Les menus sont interdits.', 'Ne commandez rien.']],
    ['Votre commande a de l’élégance.', 'Your order has elegance.', 'vo-truh ko-MAHND ah duh lay-lay-GAHNSS', ['Your order is a mess.', 'Cancel it.', 'I refuse that order.'], ['Votre commande est un désordre.', 'Annulez-la.', 'Je refuse cette commande.']],
    ['Revenez quand le soir est plus calme.', 'Come back when the evening is quieter.', 'ruh-vuh-NAY kahn luh SWAR eh plew KALM', ['Never come in the evening.', 'Only come at noon rush.', 'We lock the doors at dusk.'], ['Ne venez jamais le soir.', "Venez seulement à l'heure de pointe.", 'On ferme à la tombée du jour.']]
], 'casual');

add('sweet_talk', 'spanish', [
    ['Usted ilumina el mostrador.', 'You light up the counter.', 'oos-TED ee-loo-MEE-nah el mos-trah-DOR', ['You dim the lights.', 'Leave immediately.', 'I do not see you.'], ['Apaga las luces.', 'Váyase ya.', 'No lo veo.']],
    ['Esa sonrisa merece un éclair.', 'That smile deserves an éclair.', 'EH-sah son-RREE-sah meh-REH-seh oon ay-KLAR', ['That frown deserves nothing.', 'No pastry for you.', 'Wipe that smile.'], ['Ese ceño no merece nada.', 'Sin pastel para usted.', 'Borre esa sonrisa.']],
    ['Quédese un rato más.', 'Stay a little longer.', 'KEH-deh-seh oon RAH-toh mas', ['Leave now.', 'Never sit.', 'We close in one second.'], ['Váyase ahora.', 'Nunca se siente.', 'Cerramos en un segundo.']],
    ['Tiene usted muy buen gusto.', 'You have excellent taste.', 'TYEH-neh oos-TED mwee bwen GOOS-toh', ['Your taste is terrible.', 'Order randomly.', 'I choose for you badly.'], ['Tiene mal gusto.', 'Pida al azar.', 'Elijo mal por usted.']],
    ['Un cumplido con el café.', 'A compliment with the coffee.', 'oon koom-PLEE-doh kon el kah-FEH', ['An insult with the coffee.', 'No talking.', 'Only receipts.'], ['Un insulto con el café.', 'Sin hablar.', 'Solo recibos.']],
    ['Usted suaviza la sala.', 'You make the room softer.', 'oos-TED swah-VEE-sah lah SAH-lah', ['You make the room colder.', 'Leave the room.', 'Turn off charm.'], ['Enfría la sala.', 'Salga de la sala.', 'Apague el encanto.']],
    ['Quédese el cambio, y esa sonrisa.', 'Keep the change, and that smile.', 'KEH-deh-seh el KAHM-byoh ee EH-sah son-RREE-sah', ['Give me every coin.', 'No smiling allowed.', 'Pay extra for frowning.'], ['Deme cada moneda.', 'Prohibido sonreír.', 'Pague extra por fruncir el ceño.']],
    ['Deberíamos ponerle en el menú.', 'We should put you on the menu.', 'deh-beh-REE-ah-mos po-NEHR-leh en el meh-NOO', ['You are banned from the menu.', 'Menus are illegal.', 'Order nothing.'], ['Está prohibido en el menú.', 'Los menús son ilegales.', 'No pida nada.']],
    ['Su pedido tiene elegancia.', 'Your order has elegance.', 'soo peh-DEE-doh TYEH-neh eh-leh-GAHN-syah', ['Your order is a mess.', 'Cancel it.', 'I refuse that order.'], ['Su pedido es un desastre.', 'Cáncelo.', 'Rechazo ese pedido.']],
    ['Vuelva cuando la noche esté más calma.', 'Come back when the evening is quieter.', 'VWEHL-vah KWAN-doh lah NOH-cheh es-TEH mas KAHL-mah', ['Never come in the evening.', 'Only come at noon rush.', 'We lock the doors at dusk.'], ['Nunca venga de noche.', 'Venga solo en la hora pico.', 'Cerramos al anochecer.']]
], 'casual');

add('complaints_dept', 'french', [
    ['Ce café est tiède, voyons.', 'This coffee is lukewarm, honestly.', 'suh kah-FEH eh TYED vwah-YON', ['This coffee is perfect.', 'I love lukewarm.', 'Do not reheat it.'], ['Ce café est parfait.', "J'adore le tiède.", 'Ne le réchauffez pas.']],
    ['J’ai demandé sans noisette.', 'I asked for no hazelnut.', 'zhay duh-mahn-DAY sahn nwah-ZET', ['I asked for extra hazelnut.', 'Nuts are required.', 'This is fine.'], ["J'ai demandé plus de noisette.", 'Les noix sont obligatoires.', "C'est très bien."]],
    ['La part est trop petite pour le prix.', 'The slice is too small for the price.', 'lah PAR eh troh puh-TEET poor luh PREE', ['The slice is huge.', 'Price is a gift.', 'I will pay more gladly.'], ['La part est énorme.', 'Le prix est un cadeau.', 'Je paierai plus avec joie.']],
    ['Il y a une cheveu. Une.', 'There is a hair. One.', 'eel ee ah ewn shuh-VUH ewn', ['There is no hair.', 'Hair is garnish.', 'Eat around it happily.'], ["Il n'y a pas de cheveu.", 'Le cheveu est une garniture.', 'Mangez autour avec joie.']],
    ['Ce n’est pas ce que j’ai commandé.', 'This is not what I ordered.', 'suh nay pah suh kuh zhay ko-mahn-DAY', ['This is exactly what I ordered.', 'I forget my order.', 'Any plate is fine.'], ["C'est exactement ce que j'ai commandé.", "J'oublie ma commande.", "N'importe quelle assiette convient."]],
    ['Le service a mis une éternité.', 'Service took an eternity.', 'luh sehr-VEESS ah mee ewn ay-tehr-nee-TAY', ['Service was instant.', 'I enjoy waiting.', 'No rush ever.'], ['Le service était instantané.', "J'adore attendre.", 'Aucune urgence jamais.']],
    ['Vous pouvez reprendre ça.', 'You may take this back.', 'voo poo-VAY ruh-PRAHN-druh SAH', ['I will keep this forever.', 'Do not touch it.', 'This is perfect actually.'], ['Je garderai ça pour toujours.', "N'y touchez pas.", "C'est parfait en fait."]],
    ['Ce n’est pas cuits à cœur.', 'This is not cooked through.', 'suh nay pah kwee ah KUR', ['This is overcooked on purpose.', 'Raw is trendy.', 'I asked for dough.'], ["C'est trop cuit exprès.", 'Le cru est à la mode.', "J'ai demandé de la pâte."]],
    ['Je voudrais parler au responsable.', 'I would like to speak to the person in charge.', 'zhuh voo-DRAY par-LAY oh ruh-spon-SAH-bluh', ['I would like to leave quietly.', 'No managers exist.', 'Compliment the intern only.'], ['Je voudrais partir en silence.', "Il n'y a pas de responsable.", "Complimentez seulement le stagiaire."]],
    ['Notez ça : trop sucré.', 'Note this: too sweet.', 'no-TAY sah troh sew-KRAY', ['Note this: perfect.', 'Never write notes.', 'Add more sugar.'], ['Notez ça : parfait.', 'Ne prenez jamais de notes.', 'Ajoutez plus de sucre.']]
], 'formal');

add('complaints_dept', 'spanish', [
    ['Este café está tibio, vamos.', 'This coffee is lukewarm, honestly.', 'ES-teh kah-FEH es-TAH TEE-byoh VAH-mos', ['This coffee is perfect.', 'I love lukewarm.', 'Do not reheat it.'], ['Este café está perfecto.', 'Me encanta tibio.', 'No lo caliente.']],
    ['Pedí sin avellana.', 'I asked for no hazelnut.', 'peh-DEE seen ah-veh-YAH-nah', ['I asked for extra hazelnut.', 'Nuts are required.', 'This is fine.'], ['Pedí extra de avellana.', 'Los frutos secos son obligatorios.', 'Está bien.']],
    ['La porción es pequeña para el precio.', 'The slice is too small for the price.', 'lah por-SYON es peh-KEH-nyah PAH-rah el PREH-syoh', ['The slice is huge.', 'Price is a gift.', 'I will pay more gladly.'], ['La porción es enorme.', 'El precio es un regalo.', 'Pagaré más con gusto.']],
    ['Hay un pelo. Uno.', 'There is a hair. One.', 'ai oon PEH-lo OO-noh', ['There is no hair.', 'Hair is garnish.', 'Eat around it happily.'], ['No hay pelo.', 'El pelo es adorno.', 'Coma alrededor con alegría.']],
    ['Esto no es lo que pedí.', 'This is not what I ordered.', 'ES-toh no es lo keh peh-DEE', ['This is exactly what I ordered.', 'I forget my order.', 'Any plate is fine.'], ['Esto es exactamente lo que pedí.', 'Olvido mi pedido.', 'Cualquier plato sirve.']],
    ['El servicio tardó una eternidad.', 'Service took an eternity.', 'el sehr-VEE-syoh tar-DOH OO-nah eh-tehr-nee-DAD', ['Service was instant.', 'I enjoy waiting.', 'No rush ever.'], ['El servicio fue instantáneo.', 'Disfruto esperar.', 'Sin prisa nunca.']],
    ['Pueden llevarse esto.', 'You may take this back.', 'PWEH-den yeh-VAR-seh ES-toh', ['I will keep this forever.', 'Do not touch it.', 'This is perfect actually.'], ['Me lo quedo para siempre.', 'No lo toquen.', 'De hecho está perfecto.']],
    ['No está cocido por dentro.', 'This is not cooked through.', 'no es-TAH ko-SEE-doh por DEN-troh', ['This is overcooked on purpose.', 'Raw is trendy.', 'I asked for dough.'], ['Está recocido a propósito.', 'Lo crudo está de moda.', 'Pedí masa.']],
    ['Quisiera hablar con el responsable.', 'I would like to speak to the person in charge.', 'kee-SYEH-rah ah-BLAR kon el res-pon-SAH-bleh', ['I would like to leave quietly.', 'No managers exist.', 'Compliment the intern only.'], ['Quisiera irme en silencio.', 'No hay responsables.', 'Halague solo al pasante.']],
    ['Anoten esto: demasiado dulce.', 'Note this: too sweet.', 'ah-NOH-ten ES-toh deh-mah-SYAH-doh DOOL-seh', ['Note this: perfect.', 'Never write notes.', 'Add more sugar.'], ['Anoten esto: perfecto.', 'Nunca escriban notas.', 'Agreguen más azúcar.']]
], 'formal');

add('passive_aggressive', 'french', [
    ['Charmant. Vraiment.', 'Charming. Truly.', 'shar-MAHN vray-MAHN', ['I am delighted with no sarcasm.', 'This is sincere praise only.', 'I have no notes.'], ["Je suis ravi sans sarcasme.", "Ce n'est que de la louange sincère.", "Je n'ai aucune remarque."]],
    ['On a tous un talent.', 'We all have a talent.', 'ohn ah too zuhn tah-LAHN', ['You have no talent, wait, I mean congratulations.', 'Everyone is perfect.', 'Talent is illegal.'], ["Vous n'avez aucun talent, pardon, félicitations.", 'Tout le monde est parfait.', 'Le talent est interdit.']],
    ['Si vous insistez…', 'If you insist…', 'see voo zan-sees-TAY', ['I happily agree with joy.', 'Please insist forever.', 'No hesitation here.'], ["J'accepte avec joie.", 'Inistez pour toujours.', 'Aucune hésitation ici.']],
    ['Quelle audace culinaire.', 'What culinary audacity.', 'kel oh-DASS kew-lee-NAIR', ['What culinary genius, sincerely.', 'I bow to this recipe.', 'No notes, chef.'], ['Quel génie culinaire, sincèrement.', 'Je m’incline devant cette recette.', 'Aucune remarque, chef.']],
    ['Je note. Intérieurement.', 'I am taking notes. Internally.', 'zhuh NOT an-tay-ryur-MAHN', ['I am not judging at all.', 'No inner monologue.', 'Everything is fine.'], ['Je ne juge pas du tout.', 'Pas de monologue intérieur.', 'Tout va bien.']],
    ['Bravo pour l’effort.', 'Bravo for the effort.', 'brah-VO poor lay-FOR', ['Bravo, it is actually excellent.', 'No effort was needed.', 'I am speechless with joy.'], ["Bravo, c'est réellement excellent.", "Aucun effort n'était nécessaire.", 'Je suis sans voix de joie.']],
    ['On apprend tous les jours.', 'We all learn every day.', 'ohn ah-PRAHN too lay ZHOOR', ['You already know everything.', 'I have nothing to teach.', 'Class dismissed with medals.'], ['Vous savez déjà tout.', "Je n'ai rien à enseigner.", 'Cours terminé avec des médailles.']],
    ['Ce choix est… courageux.', 'That choice is… brave.', 'suh shwah eh koo-rah-ZHUH', ['That choice is obviously correct.', 'I would order the same proudly.', 'No comment needed.'], ['Ce choix est évidemment correct.', 'Je commanderais la même chose fièrement.', 'Aucun commentaire nécessaire.']],
    ['Le four a fait de son mieux.', 'The oven did its best.', 'luh FOOR ah fay duh son MYUH', ['The oven was perfect.', 'Blame no one including the oven.', 'Five stars for the oven.'], ['Le four était parfait.', "N'accusez personne, pas même le four.", 'Cinq étoiles pour le four.']],
    ['Je vais m’en souvenir.', 'I will remember this.', 'zhuh vay mahn soo-vuh-NEER', ['I will forget immediately.', 'No memory of this.', 'Please remind me never.'], ["Je vais l'oublier tout de suite.", 'Aucun souvenir de ceci.', 'Ne me le rappelez jamais.']]
], 'formal');

add('passive_aggressive', 'spanish', [
    ['Encantador. De verdad.', 'Charming. Truly.', 'en-kahn-tah-DOR deh vehr-DAD', ['I am delighted with no sarcasm.', 'This is sincere praise only.', 'I have no notes.'], ['Estoy encantado sin sarcasmo.', 'Solo es elogio sincero.', 'No tengo notas.']],
    ['Todos tenemos un talento.', 'We all have a talent.', 'TOH-dos teh-NEH-mos oon tah-LEN-toh', ['You have no talent, wait, I mean congratulations.', 'Everyone is perfect.', 'Talent is illegal.'], ['Usted no tiene talento, perdón, felicidades.', 'Todos son perfectos.', 'El talento es ilegal.']],
    ['Si usted insiste…', 'If you insist…', 'see oos-TED in-SEES-teh', ['I happily agree with joy.', 'Please insist forever.', 'No hesitation here.'], ['Acepto con alegría.', 'Insista para siempre.', 'Sin duda aquí.']],
    ['Qué audacia culinaria.', 'What culinary audacity.', 'keh ow-DAH-syah koo-lee-NAH-ryah', ['What culinary genius, sincerely.', 'I bow to this recipe.', 'No notes, chef.'], ['Qué genio culinario, de verdad.', 'Me inclino ante esta receta.', 'Sin notas, chef.']],
    ['Lo anoto. Por dentro.', 'I am taking notes. Internally.', 'lo ah-NOH-toh por DEN-troh', ['I am not judging at all.', 'No inner monologue.', 'Everything is fine.'], ['No juzgo en absoluto.', 'Sin monólogo interior.', 'Todo está bien.']],
    ['Bravo por el esfuerzo.', 'Bravo for the effort.', 'BRAH-vo por el es-FWER-so', ['Bravo, it is actually excellent.', 'No effort was needed.', 'I am speechless with joy.'], ['Bravo, de verdad es excelente.', 'No hacía falta esfuerzo.', 'Me quedé sin palabras de alegría.']],
    ['Todos aprendemos cada día.', 'We all learn every day.', 'TOH-dos ah-pren-DEH-mos KAH-dah DEE-ah', ['You already know everything.', 'I have nothing to teach.', 'Class dismissed with medals.'], ['Usted ya lo sabe todo.', 'No tengo nada que enseñar.', 'Clase terminada con medallas.']],
    ['Esa elección es… valiente.', 'That choice is… brave.', 'EH-sah eh-lek-SYON es vah-LYEN-teh', ['That choice is obviously correct.', 'I would order the same proudly.', 'No comment needed.'], ['Esa elección es obviamente correcta.', 'Pedaría lo mismo con orgullo.', 'No hace falta comentario.']],
    ['El horno hizo lo que pudo.', 'The oven did its best.', 'el OR-no EE-so lo keh POO-doh', ['The oven was perfect.', 'Blame no one including the oven.', 'Five stars for the oven.'], ['El horno fue perfecto.', 'No culpe a nadie, ni al horno.', 'Cinco estrellas para el horno.']],
    ['Me voy a acordar de esto.', 'I will remember this.', 'meh boy ah ah-kor-DAR deh ES-toh', ['I will forget immediately.', 'No memory of this.', 'Please remind me never.'], ['Lo olvidaré ahora mismo.', 'Sin memoria de esto.', 'No me lo recuerde nunca.']]
], 'formal');

const data = JSON.parse(readFileSync(new URL('../src/data/phrases.json', import.meta.url), 'utf8'));
const existing = new Set(data.phrases.map(x => x.id));
const fresh = extra.filter(x => !existing.has(x.id));
data.phrases.push(...fresh);
writeFileSync(new URL('../src/data/phrases.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log('added', fresh.length, 'total', data.phrases.length);
