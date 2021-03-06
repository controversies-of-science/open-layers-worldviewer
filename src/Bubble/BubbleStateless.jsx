import React from 'react';
import './Bubble.scss';
import TransitionGroup from 'react-addons-transition-group';
import { TweenMax, Bounce, Elastic, Power0 } from 'gsap';
import NumberBubble from '../NumberBubble/NumberBubble.jsx';

const AnimatedBubble = React.createClass({
	componentWillAppear: function(callback) {
		const el = this.container;
		TweenMax.fromTo(el, 2, {scale:0, opacity:0}, {scale:1, opacity:1, ease:Bounce.easeOut, onComplete: callback});
	},

	componentWillEnter: function(callback) {
		const el = this.container;
    	TweenMax.fromTo(el, .5, {scale:1.5, opacity:0}, {scale:1, opacity:1, ease:Bounce.easeOut, onComplete: callback});
	},

	// Send just one time for all 8 Bubbles
	componentDidEnter: function() {
		if (this.props.bubbleNumber === 0) {
			this.props.enterHandler();
		}
	},

	componentWillLeave: function(callback) {
	    const el = this.container;
	    TweenMax.to(el, .5, {scale:1.5, opacity:0, onComplete: callback});
	},

	componentDidLeave: function() {
	},

	currentSlide: function() {
		return this.props.slideshow[this.props.slides.current].bubble;
	},

	nextSlide: function(nextProps) {
		return nextProps.slideshow[nextProps.slides.current].bubble;
	},

	originalSlideState: function() {
		return this.props.card.graphics[this.props.bubbleNumber];
	},

	bubbleIsActive: function(bubbleNumber, slide) {
		return slide && (bubbleNumber === slide.number);
	},

	zoomsAreSame: function(from, to) {
		if (from.width === to.width &&
			from.top === to.top &&
			from.left === to.left) {
			return true;
		} else {
			return false;
		}
	},

	// Pay close attention to what is current and previous here ...
	componentWillReceiveProps: function(nextProps) {
		let num, slide;

		if (this.props.slides.active && !nextProps.slides.active) { // direct click unzoom
			num = this.props.bubbleNumber;
			slide = this.currentSlide();
			this.bubbleIsActive(num, slide) && this.unzoom(nextProps);

		} else if (!this.props.slides.active && nextProps.slides.active) { // direct click zoom
			num = nextProps.bubbleNumber;
			slide = this.nextSlide(nextProps);
			this.bubbleIsActive(num, slide) && this.zoom(nextProps);

		} else if (this.props.slides.current !== nextProps.slides.current) {

			if (!this.currentSlide()) { // from unzoomed
				num = nextProps.bubbleNumber;
				slide = this.nextSlide(nextProps);
				this.bubbleIsActive(num, slide) && this.zoom(nextProps);

			} else if (this.nextSlide(nextProps)) { // to/from zoomed
				num = this.props.bubbleNumber;
				slide = this.currentSlide();
				this.bubbleIsActive(num, slide) && this.scale(nextProps);

			} else { // from zoomed / to unzoomed
				num = this.props.bubbleNumber;
				slide = this.currentSlide();
				this.bubbleIsActive(num, slide) && this.unzoom(nextProps);
			}
		}
	},

	componentDidMount: function() {
	},

	getComponent: function(bubbleNumber) {
		this.props.clickHandler(bubbleNumber);
	},

	zoom: function(nextProps) {
		const el = this.container,
			bubbleString = 'bubble' + this.props.bubbleNumber,
			zindex = parseInt(this.props.card.zindexes[bubbleString], 10),
			nextZindex = parseInt(nextProps.card.zindexes[bubbleString], 10);

		const { left, top, width } = this.originalSlideState(),
			from = { left:left, top:top, width:width },
			to = this.nextSlide(nextProps);

		if (!this.zoomsAreSame(from, to)) {
			this.props.shadeElements([bubbleString], 0.3);

			TweenMax.fromTo(el, 2, {width:from.width, left:from.left, top:from.top, zIndex:zindex},
					{width:to.width, left:to.left, top:to.top, zIndex:nextZindex, ease:Elastic.easeOut});
		}
	},

	unzoom: function(nextProps) {
		const el = this.container,
			bubbleString = 'bubble' + this.props.bubbleNumber,
			zindex = parseInt(this.props.card.zindexes[bubbleString], 10),
			nextZindex = parseInt(nextProps.card.zindexes[bubbleString], 10);

		const { left, top, width } = this.originalSlideState(),
			to = { left:left, top:top, width:width },
			from = this.currentSlide();

		if (!this.zoomsAreSame(from, to)) {
			setTimeout(() => {
				this.props.resetElementZindexes();
			}, 2000);

			this.props.unshadeElements();

			TweenMax.fromTo(el, 2, {width:from.width, left:from.left, top:from.top, zIndex:zindex},
					{width:to.width, left:to.left, top:to.top, zIndex:nextZindex, ease:Elastic.easeIn});
		}
	},

	scale: function(nextProps) {
		const el = this.container;

		const to = this.nextSlide(nextProps),
			from = this.currentSlide();

		if (!this.zoomsAreSame(from, to)) {
			TweenMax.fromTo(el, 6, {width:from.width, left:from.left, top:from.top},
				{width:to.width, left:to.left, top:to.top, ease:Power0.easeNone});
		}

		// TODO: Convert pans to zoom out / in (reduces nausea, may require refactoring slides to encode this info)
		// let mid = {};
		// mid.width = parseInt(this.props.card.graphics[this.props.bubbleNumber].width, 10)/2;
		// mid.left = (parseInt(to.left, 10) - parseInt(from.left, 10))/2;
		// mid.top = (parseInt(to.top, 10) - parseInt(from.top, 10))/2;

		// mid.width += 'vw';
		// mid.left += 'vw';
		// mid.top += 'vw';

		// console.log('mid: ', mid);

		// if (!this.zoomsAreSame(from, to)) {
		// 	TweenMax.fromTo(el, 3, {width:from.width, left:from.left, top:from.top},
		// 		{width:mid.width, left:mid.left, top:mid.top, ease:Power0.easeNone, onComplete: () => {

		// 			TweenMax.fromTo(el, 3, {width:mid.width, left:mid.left, top:mid.top},
		// 				{width:to.width, left:to.left, top:to.top, ease:Power0.easeNone});

		// 		}
		// 	});
		// }
	},

	render: function() {
		const original = this.originalSlideState(),
			isActive = this.props.slideShow && this.bubbleIsActive(this.props.bubbleNumber, this.currentSlide());

		const divStyle = {
			left: (isActive && this.currentSlide().left) || original.left,
			position: 'absolute',
			top: (isActive && this.currentSlide().top) || original.top,
			width: (isActive && this.currentSlide().width) || original.width,
			zIndex: this.props.zindex
		};

		const imgStyle = {
			width: '100%'
		};

		return (
			<div style={divStyle} ref={c => this.container = c}>
				<img
					alt="Figure"
					className={"Bubble Bubble" + this.props.bubbleNumber}
					onClick={this.getComponent.bind(this, this.props.bubbleNumber)}
					src={this.props.source}
					style={imgStyle} />

				<NumberBubble
					key={this.props.bubbleNumber}
					left={this.props.numleft}
					bubbleNumber={this.props.bubbleNumber}
					showOverlay={this.props.showOverlay}
					spin={this.props.spin[this.props.bubbleNumber]}
					top={this.props.numtop} />
			</div>
		)
	}
});

const BubbleStateless = React.createClass({
	render: function() {
		const bubbleString = 'bubble' + this.props.bubbleNumber,
			zindex = this.props.card.zindexes[bubbleString];

		return (
			<TransitionGroup component="div">
				{ this.props.showOverlay &&
					<AnimatedBubble
						card={this.props.card}
						slideshow={this.props.slideshow}
						bubbles={this.props.bubbles}
						active={this.props.active}
						clickBubble={this.props.clickBubble}
						clickHandler={this.props.clickHandler}
						enterHandler={this.props.enterHandler}
						key={this.props.bubbleNumber}
						left={this.props.left}
						bubbleNumber={this.props.bubbleNumber}
						numleft={this.props.numleft}
						numtop={this.props.numtop}
						showOverlay={this.props.showOverlay}
						source={this.props.source}
						spin={this.props.spin}
						top={this.props.top}
						width={this.props.width}
						slides={this.props.slides}
						shadeElements={this.props.shadeElements}
						unshadeElements={this.props.unshadeElements}
						resetElementZindexes={this.props.resetElementZindexes}
						zindex={zindex}
						clearQuoteTimers={this.props.clearQuoteTimers}
						setCurrentQuote={this.props.setCurrentQuote}
						setCurrentQuoteTimer={this.props.setCurrentQuoteTimer}
						toggleQuote={this.props.toggleQuote}
						quotes={this.props.quotes}
						/>
				}
			</TransitionGroup>
		);
	}
});

export default BubbleStateless;
