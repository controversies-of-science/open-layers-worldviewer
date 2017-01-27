import React, { Component } from 'react';
import base from '../graphics/halton-arp-the-modern-galileo-bbal-card.jpg';
import Bubble from './Bubble';
import Icon from './Icon';
import './ControversyCard.scss';

class ControversyCard extends Component {
	render() {
		let bubbles = [
			{source: 'bubble0.png', left: '7vw', top: '23vw', width: '24vw'},
			{source: 'bubble1.png', left: '6vw', top: '55vw', width: '14vw'},
			{source: 'bubble2.png', left: '21vw', top: '50vw', width: '10vw'},
			{source: 'bubble3.png', left: '37vw', top: '33vw', width: '12vw'},
			{source: 'bubble4.png', left: '52vw', top: '27vw', width: '16vw'},
			{source: 'bubble5.png', left: '70vw', top: '36vw', width: '9vw'},
			{source: 'bubble6.png', left: '69vw', top: '46vw', width: '9vw'},
			{source: 'bubble7.png', left: '78vw', top: '49vw', width: '16vw'}
		];

		return (
			<div className="Card">
				<img src={base} className="Base-Layer"
					alt="Controversy Card: Halton Arp, the Modern Galileo" />
				<p className="Title Left">Halton<br/>Arp</p>
				<p className="Title Right">The<br/>Modern<br/>Galileo</p>
				<p className="Summary">He Was a Professional Astronomer Who<br/>Began his Career as Edwin Hubble's Assistant / While Compiling a List of Peculiar Galaxies, Arp Discovered that High-Redshift Quasars are Commonly Associated with or Even Connected by Filaments to Lower-Redshift Galaxies / Since the Big Bang Requires that Differences in Redshift Place the Objects at Different Locations, Astronomers Commonly Reject Arp's Claims / But if he is Right, then there Was No Big Bang</p>

				{ bubbles.map( (el,i) => 
					<Bubble
						key={'bubble' + i}
						source={el.source}
						left={el.left}
						top={el.top}
						width={el.width}
					/>
				)}

				<Icon
					left='78vw'
					top='67vw'
					width='13vw'
				/>
			</div>
		);
	}
}

export default ControversyCard;
