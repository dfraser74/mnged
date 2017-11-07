import { h, Component } from 'preact';

import { firestore, auth } from '../../../lib/firebase';
import TextInput from '../../../components/textInput';
import DefaultButton from '../../../components/button';
import Card from '../../../components/card';
import style from './style';

const template = [
	[ 'block_a', 'Block A' ],
	[ 'block_b', 'Block B' ],
	[ 'block_c', 'Block C' ],
	[ 'block_d', 'Block D' ],
	[ 'block_e', 'Block E' ],
	[ 'block_f', 'Block F' ],
	[ 'block_g', 'Block G' ],
	[ 'block_h', 'Block H' ],
	[ 'flex', 'Flex' ]
];

let myState = {
	block_a: {},
	block_b: {},
	block_c: {},
	block_d: {},
	block_e: {},
	block_f: {},
	block_g: {},
	block_h: {},
	flex: {
		class: 'Flex'
	}
};

const colors = [
	'#d32f2f',
	'#7b1fa2',
	'#1976d2',
	'#00897b',
	'#7cb342',
	'#ff8f00',
	'#795548',
	'#546e7a'
]

export default class SetClass extends Component {
	
	handleChange(evt) {
		myState[evt.target.name.split('-')[0]][evt.target.name.split('-')[1]] = evt.target.value;
	}

	proccessForm(evt) {
		evt.preventDefault();
		console.log(auth.currentUser.uid);

		const batch = firestore.batch();

		const classesRef = firestore
			.collection('users')
			.doc(auth.currentUser.uid)
			.collection('classes');

		for (let key in myState) {

			if (!myState.hasOwnProperty(key)) continue;
			
			batch.set(classesRef.doc(key), myState[key]);
		}

		batch.commit().then(() => {
			console.log('done');
		});

	}
	
	constructor() {
		super();
		this.state = null;
	}

	renderColorInput(color, item) {
		return (
			<input
				onChange={this.handleChange.bind(this)}
				style={{ backgroundColor: color }}
				required
				type="radio"
				value={color}
				name={item[0] + '-color'}
			/>
		)
	}

	renderInput(item) {
		return (
			<div class={style.inputGroup}>
				<h4 class={style.title}>{item[1]}:</h4>
				{item[0] !== 'flex' && <TextInput displayName="Class" name={item[0] + '-class'} eventHandler={this.handleChange.bind(this)} required />}
				<TextInput displayName="Room" name={item[0] + '-room'} eventHandler={this.handleChange.bind(this)} required />
				<TextInput displayName="Teacher" name={item[0] + '-teacher'} eventHandler={this.handleChange.bind(this)} required />
				<div class={style.input}>
					<center>
						{colors.map((color, i) => this.renderColorInput(color, item))}
					</center>
				</div>
			</div>);
	}

	render() {
		return (
			<div class={style.wrapper}>
				<Card class={style.card}>
					<h3>Set classes</h3>	
					<p>Before you can start using mnged, we need your schedule. Please insert your class, room and teacher for the corresponding block. You are also able to select a color assosiated with that class:</p>
					<form onSubmit={this.proccessForm.bind(this)}>
						{template.map((item, i) => (
							<div>{this.renderInput(item)}</div>
						))}
						<input type="submit" value="Set classes" />
					</form>
				</Card>
			</div>
		);
	}
}