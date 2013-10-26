var intervals = require('./intervals.js'),
	notes = require('./notes.js'),
	diatonic = require('./diatonic.js');

// A cache for composed triads
_triads_cache = {};
// A cache for composed sevenths
_sevenths_cache = {};

// A dictionairy that can be used to present
// lookup chord abbreviations. This dictionairy is also
// used in determine_seventh()
chord_shorthand_meaning = {
		// Triads
		"m" : " minor triad",
		"M" : " major triad",
		"" : " major triad",
		"dim" : " diminished triad",

		// Augmented chords
		"aug" : " augmented triad",
		"+" : " augmented triad",
		"7#5" : " augmented minor seventh",
		"M7+5" : " augmented minor seventh",
		"M7+" : " augmented major seventh",
		"m7+" : " augmented minor seventh",
		"7+" : " augmented major seventh",

		// Suspended chords
		"sus47" :" suspended seventh",
		"sus4" :" suspended fourth triad",
		"sus2" :" suspended second triad",
		"sus" :" suspended fourth triad",
		"11" :" eleventh",
		"sus4b9" :" suspended fourth ninth",
		"susb9" :" suspended fourth ninth",

		// Sevenths
		"m7" :" minor seventh",
		"M7" :" major seventh",
		"dom7" :" dominant seventh",
		"7" :" dominant seventh",
		"m7b5" :" half diminished seventh",
		"dim7" :" diminished seventh",
		"m/M7" :" minor/major seventh",
		"mM7" :" minor/major seventh",
		
		// Sixths
		"m6" : " minor sixth",
		"M6" : " major sixth",
		"6" : " major sixth", 
		"6/7" : " dominant sixth",
		"67": " dominant sixth",
		"6/9" :" sixth ninth",
		"69" : " sixth ninth",

		// Ninths
		"9" : " dominant ninth",
		"7b9" : " dominant flat ninth",
		"7#9" :" dominant sharp ninth",
		"M9" :" major ninth",
		"m9" :" minor ninth",

		// Elevenths
		"7#11" :" lydian dominant seventh",
		"m11" :" minor eleventh",

		// Thirteenths
		"M13" :" major thirteenth",
		"m13" :" minor thirteenth",

		"13" :" dominant thirteenth",

		// Altered Chords
		"7b5" :" dominant flat five",
		
		// Special
		"hendrix" :" hendrix chord",
		"7b12" :" hendrix chord",
		"5" :" perfect fifth"
};

/*===================================================================
							Triads
===================================================================*/

// diatonic

function triad(note, key) {
	/*Returns the triad on note in key as a list.
	Examples:
	>>> triad("E", "C") /return ["E", "G", "B"]
	>>> triad("E", "B") // return ["E", "G#", "B"]
	*/
	return [note, intervals.third(note, key), intervals.fifth(note, key)]
}

function triads(key) {
	//Returns all the triads in key. Implemented using a cache.
	if(_triads_cache.hasOwnProperty(key)) {
		return _triads_cache[key];
	}
	var res = diatonic.get_notes(key).map(function (x) {
		return triad(x, key);
	});
	_triads_cache[key] = res;
	return res;
}

// absolute

function major_triad(note) {
	/*Builds a major triad on note.
	Example:
	{{{
	>>> major_triad("C")
	["C", "E", "G"]
	*/
	return [note, intervals.major_third(note), intervals.perfect_fifth(note)];
}

function minor_triad(note) {
	/* Builds a minor triad on note.
	Example:
	{{{
	>>> minor_triad("C")
	["C", "Eb", "G"]
	}}} */
	return [note, intervals.minor_third(note), intervals.perfect_fifth(note)];
}

function diminished_triad(note) {
	/* Builds a diminished triad on note.
	Example:
	{{{
	>>> diminished_triad("C")
	["C", "Eb", "Gb"]
	}}}*/
	return [note, intervals.minor_third(note), intervals.minor_fifth(note)];
}

function augmented_triad(note) {
	/*Builds an augmented triad on note.
	Example:
	{{{
	>>> augmented_triad("C")
	["C", "E", "G#"]
	}}}*/
	return [note, intervals.major_third(note), notes.augment(intervals.major_fifth(note))];
}


/*===================================================================
							Sevenths
===================================================================*/

// diatonic

function seventh(note, key) {
	/*Returns the seventh chord on note in key.
	Example:
	{{{
	>>> seventh("C", "C")
	["C", "E", "G", "B"]
	}}}*/
	var arr = triad(note, key);
	arr.push(intervals.seventh(note, key));
	return arr;
}


function sevenths(key) {
	/*Returns all the sevenths chords in key in a list*/
	if(_sevenths_cache.hasOwnProperty(key)) {
		return _sevenths_cache[key];
	}

	res = diatonic.get_notes(key).map(function (x) {
		return seventh(x, key);
	});
	_sevenths_cache[key] = res;
	return res;
}

//absolute

function major_seventh(note) {
	/*Builds a major seventh on note.
	Example:
	{{{
	>>> major_seventh("C") 
	["C", "E", "G", "B"]
	}}}*/
	var arr = major_triad(note);
	arr.push(intervals.major_seventh(note));
	return arr;
}

function minor_seventh(note) {
	/*Builds a minor seventh on note.
	Example:
	{{{
	>>> minor_seventh("C")
	["C", "Eb", "G", "Bb"]
	}}}*/
	var arr = minor_triad(note);
	arr.push(intervals.minor_seventh(note));
	return arr;
}

function dominant_seventh(note) {
	/*Builds a dominant seventh on note.
	Example:
	{{{
	>>> dominant_seventh("C")
	["C", "E", "G", "Bb"]
	}}}*/
	var arr = major_triad(note);
	arr.push(intervals.minor_seventh(note));
	return arr;
}

function half_diminished_seventh(note) {
	/*Builds a half diminished seventh (=minor seventh flat five) \
	chord on note.
		Example:
	{{{
	>>> half_diminished_seventh("C")
	["C", "Eb", "Gb", "Bb"]
	}}}*/
	var arr = diminished_triad(note);
	arr.push(intervals.minor_seventh(note));
	return  arr;
}

function minor_seventh_flat_five(note) {
	/*See half_diminished_seventh(note) for docs*/
	return half_diminished_seventh(note);
}

function diminished_seventh(note) {
	/*Builds a diminished seventh chord on note.
	Example:
	{{{
	>>> diminished_seventh("C") 
	["C", "Eb", "Gb", "Bbb"]
	}}}*/
	var arr = diminished_triad(note);
	arr.push(notes.diminish(intervals.minor_seventh(note)));
	return arr;
}

function minor_major_seventh(note) {
	/*Builds a minor major seventh chord on note.
	Example:
	{{{
	>>> minor_major_seventh("C")
	["C", "Eb", "G", "B"]
	}}}*/
	var arr = minor_triad(note);
	arr.push(intervals.major_seventh(note));
	return arr;
}

/*===================================================================
							Sixths
===================================================================*/

// absolute

function minor_sixth(note) {
	/*Builds a minor sixth chord on note.
	Example:
	{{{
	>>> minor_sixth("C")
	['C', 'Eb', 'G', 'A']
	}}}*/
	var arr = minor_triad(note);
	arr.push(intervals.major_sixth(note));
	return arr;
}

function major_sixth(note) {
	/*Builds a major sixth chord on note.
	Example:
	{{{
	>>> major_sixth("C")
	['C', 'E', 'G', 'A']
	}}}*/
	var arr = major_triad(note);
	arr.push(intervals.major_sixth(note));
	return arr;
}

function dominant_sixth(note) {
	/*Builds the altered chord 6/7 on note.
	Example:
	{{{
	>>> dominant_sixth("C")
	['C', 'E', 'G', 'A', 'Bb']
	}}}*/
	var arr = major_sixth(note);
	arr.push(intervals.minor_seventh(note));
	return arr;
}

function sixth_ninth(note) {
	/*Builds the sixth/ninth chord on note.
	Example:
	{{{
	>>> sixth_ninth('C')
	['C', 'E', 'G', 'A', 'D']
	}}}*/
	var arr = major_sixth(note);
	arr.push(intervals.major_second(note));
	return arr;
}

/*===================================================================
							Ninths
===================================================================*/

// absolute

function minor_ninth(note) {
	/*Builds a minor ninth chord on note.
	Example:
	{{{
	>>> minor_ninth("C")
	['C', 'Eb', 'G', 'Bb', 'D']
	}}}*/
	var arr = minor_seventh(note);
	arr.push(intervals.major_second(note));
	return arr;
}

function major_ninth(note) {
	/*Builds a major ninth chord on note.
	Example:
	{{{
	>>> major_ninth("C")
	['C', 'E', 'G', 'B', 'D']
	}}}*/
	var arr = major_seventh(note);
	arr.push(intervals.major_second(note));
	return arr;
}

function dominant_ninth(note) {
	/*Builds a dominant ninth chord on note.
	Example:
	{{{
	>>> dominant_ninth("C")
	['C', 'E', 'G', 'Bb', 'D']
	}}}*/
	var arr = dominant_seventh(note);
	arr.push(intervals.major_second(note));
	return arr;
}

function dominant_flat_ninth(note) {
	/*Builds a dominant flat ninth chord on note.
	Example:
	{{{
	>>> dominant_ninth("C")
	['C', 'E', 'G', 'Bb', 'Db']
	}}}*/
	var res = dominant_ninth(note);
	res[4] = intervals.minor_second(note);
	return res;
}

function dominant_sharp_ninth(note) {
	/*Builds a dominant sharp ninth chord on note.
	Example:
	{{{
	>>> dominant_ninth("C")
	['C', 'E', 'G', 'Bb', 'D#']
	}}}*/
	var res = dominant_ninth(note);
	res[4] = notes.augment(intervals.major_second(note));
	return res;
}

/*===================================================================
							Elevenths
===================================================================*/

// diatonic


// absolute


function eleventh(note) {
	/*Builds an eleventh chord on note.
	Example:
	{{{
	>>> eleventh("C")
	['C', 'G', 'Bb', 'F']
	}}}*/
	return [note, intervals.perfect_fifth(note), intervals.minor_seventh(note), intervals.perfect_fourth(note)];
}

function minor_eleventh(note) {
	/*Builds a minor eleventh chord on note.
	Example:
	{{{
	>>> minor_eleventh("C")
	['C', 'Eb', 'G', 'Bb', 'F']
	}}}*/
	var arr = minor_seventh(note);
	arr.push(intervals.perfect_fourth(note));
	return arr;
}

/*===================================================================
							Thirteenths
===================================================================*/

// absolute

function minor_thirteenth(note) {
	/*Builds a minor thirteenth chord on note.
	Example:
	{{{
	>>> minor_thirteenth('C')
	['C', 'Eb', 'G', 'Bb', 'D', 'A']
	}}}*/
	var arr = minor_ninth(note);
	arr.push(intervals.major_sixth(note));
	return arr;
}


function major_thirteenth(note) {
	/*Builds a major thirteenth chord on note.
	Example:
	{{{
	>>> major_thirteenth('C')
	['C', 'E', 'G', 'B', 'D', 'A']
	}}}*/
	var arr = major_ninth(note);
	arr.push(intervals.major_sixth(note));
	return arr;
}


function dominant_thirteenth(note) {
	/*Builds a dominant thirteenth chord on note.
	Example:
	{{{
	>>> dominant_thirteenth('C')
	['C', 'E', 'G', 'Bb', 'D', 'A']
	}}}*/
	var arr = dominant_ninth(note);
	arr.push(intervals.major_sixth(note));
	return arr;
}

/*===================================================================
							Suspended Chords
===================================================================*/

// absolute

function suspended_triad(note) {
	/*An alias for suspended_fourth_triad*/
	return suspended_fourth_triad(note)
}


function suspended_second_triad(note) {
	/*Builds a suspended second triad on note.
	Example:
	{{{
	>>> suspended_second_triad("C")
	["C", "D", "G"]
	}}}*/
	return [note, intervals.major_second(note), intervals.perfect_fifth(note)];
}


function suspended_fourth_triad(note) {
	/*Builds a suspended fourth triad on note.
	Example:
	{{{
	>>> suspended_fourth_triad("C")
	["C", "F", "G"]
	}}}*/
	return [note, intervals.perfect_fourth(note), intervals.perfect_fifth(note)]
}

function suspended_seventh(note) {
	/*Builds a suspended (flat) seventh chord on note.
	Example:
	{{{
	>>> suspended_seventh("C")
	["C", "F", "G", "Bb"]
	}}}*/
	var arr = suspended_fourth_triad(note);
	arr.push(intervals.minor_seventh(note));
	return arr;
}

function suspended_fourth_ninth(note) {
	/*Builds a suspended fourth flat ninth chord on note.
	Example:
	{{{
	>>> suspended_ninth("C")
	['C', 'F', 'G', 'Db']
	}}}*/
	var arr = suspended_fourth_triad(note);
	arr.push(intervals.minor_second(note));
	return arr;
}

/*===================================================================
							Augmented Chords
===================================================================*/

function augmented_major_seventh(note) {
	/*Builds an augmented major seventh chord on note.
	Example:
	{{{
	>>> augmented_major_seventh("C") 
	["C", "E", "G#", "B"]
	}}}*/
	var arr = augmented_triad(note);
	arr.push(intervals.major_seventh(note));
	return arr;
}

function augmented_minor_seventh(note) {
	/*Builds an augmented minor seventh chord on note.
	Example:
	{{{
	>>> augmented_minor_seventh("C")
	["C", "E", "G#", "Bb"]
	}}}*/
	var arr = augmented_triad(note);
	arr.push(intervals.minor_seventh(note));
	return arr;
}

/*===================================================================
							Various, Altered and Special chords
===================================================================*/
function dominant_flat_five(note) {
	/*Builds a dominant flat five chord on note.
	Example:
	{{{
	>>> dominant_flat_five("C")
	['C', 'E', 'Gb', 'Bb']
	}}}*/
	var res = dominant_seventh(note)
	res[2] = notes.diminish(res[2])
	return res;
}

function lydian_dominant_seventh(note) {
	/*Builds the lydian dominant seventh (7#11) on note
	Example:
	{{{
	>>> lydian_dominant_seventh('C')
	['C', 'E', 'G', 'Bb', 'F#']
	}}}*/
	var arr = dominant_seventh(note);
	arr.push(notes.augment(intervals.perfect_fourth(note)));
	return arr;
}

function hendrix_chord(note) {
	/*Builds the famous Hendrix chord (7b12)
	Example:
	{{{
	>>> hendrix_chord('C')
	['C', 'E', 'G', 'Bb', 'Eb']
	}}}*/
	var arr = dominant_seventh(note);
	arr.push(intervals.minor_third(note));
	return arr;
}

/*===================================================================
							Chords by harmonic function
===================================================================*/

function tonic(key) {
	/*Returns the tonic chord in key.
	Example:
	{{{
	>>> tonic("C") 
	["C", "E", "G"]
	}}}*/
	return triads(key)[0];
}

function tonic7(key) {
	/*Same as tonic(key), but returns seventh chord instead*/
	return sevenths(key)[0];
}

function supertonic(key) {
	/*Returns the supertonic chord in key.
	Example:
	{{{
	>>> supertonic("C")
	["D", "F", "A"]
	}}}*/
	return triads(key)[1];
}

function supertonic7(key) {
	/*Same as supertonic(key), but returns seventh chord*/
	return sevenths(key)[1];
}

function mediant(key) {
	/*Returns the mediant chord in key.
	Example:
	{{{
	>>> mediant("C") 
	["E", "G", "B"]
	}}}*/
	return triads(key)[2];
}

function mediant7(key) {
	/*Same as mediant(key), but returns seventh chord*/
	return sevenths(key)[2];
}

function subdominant(key) {
	/*Returns the subdominant chord in key.
	Example:
	{{{
	>>> subdominant("C") 
	["F", "A", "C"]
	}}}*/
	return triads(key)[3];
}

function subdominant7(key) {
	/*Same as subdominant(key), but returns seventh chord*/
	return sevenths(key)[3];
}

function dominant(key) {
	/*Returns the dominant chord in key.
	Example:
	{{{
	>>> dominant("C") 
	["G", "B", "D"]
	}}}*/
	return triads(key)[4];
}

function dominant7(key) {
	/*Same as dominant(key), but returns seventh chord*/
	return sevenths(key)[4];
}

function submediant(key) {
	/*Returns the submediant chord in key.
	Example:
	{{{
	>>> submediant("C") 
	["A", "C", "E"]
	}}}*/
	return triads(key)[5];
}

function submediant7(key) {
	/*Same as submediant(key), but returns seventh chord*/
	return sevenths(key)[5];
}

function subtonic(key) {
	/*Returns the subtonic in key.
	Example:
	{{{
	>>> subtonic("C")
	['B', 'D', 'F']
	}}}*/
	return triads(key)[6];
}

function subtonic7(key) {
	/*Same as subtonic(key), but returns seventh chord*/
	return sevenths(key)[6];
}

/*===================================================================
							Aliases
===================================================================*/

function I(key) {
	return tonic(key);
}

function I7(key) {
	return tonic7(key);
}

function ii(key) {
	return supertonic(key);
}

function II(key) {
	return supertonic(key);
}

function ii7(key) {
	return supertonic7(key);
}

function II7(key) {
	return supertonic7(key);
}

function iii(key) {
	return mediant(key);
}

function III(key) {
	return mediant(key);
}

function iii7(key) {
	return mediant7(key);
}

function III7(key) {
	return mediant7(key);
}

function IV(key) {
	return subdominant(key);
}

function IV7(key) {
	return subdominant7(key);
}

function V(key) {
	return dominant(key);
}

function V7(key) {
	return dominant7(key);
}

function vi(key) {
	return submediant(key);
}

function VI(key) {
	return submediant(key);
}

function vi7(key) {
	return submediant7(key);
}

function VI7(key) {
	return submediant7(key);
}

function vii(key) {
	return subtonic(key);
}

function VII(key) {
	return subtonic(key);
}

function vii7(key) {
	return subtonic(key);
}

function VII7(key) {
	return subtonic7(key);
}

//export}

exports._triads_cache = _triads_cache;
exports._sevenths_cache = _sevenths_cache;
exports.chord_shorthand_meaning = chord_shorthand_meaning;
exports.triad = triad;
exports.triads = triads;
exports.major_triad = major_triad;
exports.minor_triad = minor_triad;
exports.diminished_triad = diminished_triad;
exports.augmented_triad = augmented_triad;
exports.major_seventh = major_seventh;
exports.minor_seventh = minor_seventh;
exports.dominant_seventh = dominant_seventh;
exports.half_diminished_seventh = half_diminished_seventh;
exports.minor_seventh_flat_five = minor_seventh_flat_five;
exports.diminished_seventh = diminished_seventh;
exports.minor_major_seventh = minor_major_seventh;
exports.minor_sixth = minor_sixth;
exports.major_sixth = major_sixth;
exports.dominant_sixth = dominant_sixth;
exports.sixth_ninth = sixth_ninth;
exports.minor_ninth = minor_ninth;
exports.major_ninth = major_ninth;
exports.dominant_ninth = dominant_ninth;
exports.dominant_flat_ninth = dominant_flat_ninth
exports.dominant_sharp_ninth = dominant_sharp_ninth;
exports.eleventh = eleventh;
exports.minor_eleventh = minor_eleventh;
exports.minor_thirteenth = minor_thirteenth;
exports.major_thirteenth = major_thirteenth;
exports.dominant_thirteenth = dominant_thirteenth;
exports.suspended_triad = suspended_triad;
exports.suspended_second_triad = suspended_second_triad;
exports.suspended_fourth_triad = suspended_fourth_triad;
exports.suspended_seventh = suspended_seventh;
exports.suspended_fourth_ninth = suspended_fourth_ninth;
exports.augmented_major_seventh = augmented_major_seventh;
exports.augmented_minor_seventh = augmented_minor_seventh;
exports.dominant_flat_five = dominant_flat_five;
exports.lydian_dominant_seventh = lydian_dominant_seventh;
exports.hendrix_chord = hendrix_chord;
exports.tonic = tonic;
exports.tonic7 = tonic7;
exports.supertonic = supertonic;
exports.supertonic7 = supertonic7;
exports.mediant = mediant;
exports.mediant7 = mediant7;
exports.subdominant = subdominant;
exports.subdominant7 = subdominant7;
exports.dominant = dominant;
exports.dominant7 = dominant7;
exports.submediant = submediant;
exports.subdominant7 = subdominant7;
exports.subtonic = subtonic;
exports.subtonic7 = subtonic7;
exports.I = I;
exports.I7 = I7;
exports.ii = ii;
exports.II = II;
exports.ii7 = ii7;
exports.II7 = II7;
exports.iii = iii;
exports.III = III;
exports.iii7 = iii7;
exports.III7 = III7;
exports.IV = IV;
exports.IV7 = IV7;
exports.V = V;
exports.V7 = V7;
exports.vi = vi;
exports.VI = VI;
exports.vi7 = vi7;
exports.VI7 = VI7;
exports.vii = vii;
exports.VII = VII;
exports.vii7 = vii7;
exports.VII7 = VII7;