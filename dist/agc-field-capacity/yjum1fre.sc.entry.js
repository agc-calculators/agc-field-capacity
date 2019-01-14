/*! Built with http://stenciljs.com */
const{h:t}=window.AgcFieldCapacity,e=(t,e)=>{let i=t.querySelector(`[name="${e}"]`),a=t.querySelector(`[data-validates="${e}"`);return i.checkValidity()?(i.className=i.className.replace(" invalid",""),a.style.display="none",!0):(-1===i.className.indexOf("invalid")&&(i.className+=" invalid"),a.style.display="block",!1)},i=(t,e)=>+(Math.round(new Number(`${t}e+${e}`).valueOf())+"e-"+e);class a{constructor(){this.socket="",this.tract="",this.units={width:"ft",land:"A",speed:"mph"},this.mode="step",this.currentStep=0,this.cache={},this.submitted=!1,this.results={}}render(){return t("div",null,t("form",{onSubmit:t=>t.preventDefault(),ref:t=>this.form=t,"data-wizard":"agc-field-capacity","data-wizard-mode":this.mode,class:"agc-wizard"},t("slot",null),t("section",{"data-wizard-section":"1"},t("div",{class:"agc-wizard__field"},t("label",{"data-i18n":"fields.implement-width"},"Implement Width"),t("input",{name:"implementWidth",type:"text",required:!0,min:"1",step:"0.1"}),t("p",{class:"agc-wizard__validation-message","data-i18n":"validation.implement-width.required","data-validates":"implementWidth"},"Please enter a value."),t("p",{"data-i18n":`hints.implement-width.${this.units.width}`},"⮤ Enter the width of the implement in feet.")),t("div",{class:"agc-wizard__actions"},"step"===this.mode&&t("button",{class:"agc-wizard__actions-next","data-i18n":"actions.next",onClick:this.nextPrev.bind(this,1)},"Next 🠖"))),t("section",{"data-wizard-section":"2"},t("div",{class:"agc-wizard__field"},t("label",{"data-i18n":"fields.working-speed"},"Working Speed"),t("input",{name:"workingSpeed",type:"text",required:!0,min:"1",step:"0.1"}),t("p",{class:"agc-wizard__validation-message","data-i18n":"validation.working-speed.required","data-validates":"workingSpeed"},"Please enter a value."),t("p",{"data-i18n":`hints.working-speed.${this.units.speed}`},"⮤ Enter the average working field speed in miles per hour.")),t("div",{class:"agc-wizard__actions"},"step"===this.mode&&[t("button",{class:"agc-wizard__actions-prev","data-i18n":"actions.prev",onClick:this.nextPrev.bind(this,-1)},"🠔 Back"),t("button",{class:"agc-wizard__actions-next","data-i18n":"actions.next",onClick:this.nextPrev.bind(this,1)},"Next 🠖")])),t("section",{"data-wizard-section":"3"},t("div",{class:"agc-wizard__field"},t("label",{"data-i18n":"fields.field-efficiency"},"Field Efficiency"),t("input",{name:"fieldEfficiency",type:"text",required:!0,min:"1",step:"0.1"}),t("p",{class:"agc-wizard__validation-message","data-i18n":"validation.field-efficiency.required","data-validates":"fieldEfficiency"},"Please enter a value."),t("p",{"data-i18n":"hints.field-efficiency"},"⮤ Enter the estimated field efficiency percentage.")),t("div",{class:"agc-wizard__actions"},"step"===this.mode&&t("button",{class:"agc-wizard__actions-prev","data-i18n":"actions.prev",onClick:this.nextPrev.bind(this,-1)},"🠔 Back"),t("button",{class:"agc-wizard__actions-next","data-i18n":"actions.finish",onClick:this.nextPrev.bind(this,"step"===this.mode?1:3)},"Calculate 🠖"))),t("section",{"data-wizard-results":!0},t("slot",{name:"results"}))))}showTab(t){"step"===this.mode&&(this.cache.sections[t].style.display="block"),this.socket&&this.agcStepChanged.emit({socket:this.socket,tract:this.tract,step:this.currentStep})}reset(){this.currentStep=0,this.submitted=!1,this.showTab(0)}validateForm(){let t=!0;return 0!==this.currentStep&&"full"!==this.mode||e(this.form,"implementWidth")||(t=!1),1!==this.currentStep&&"full"!==this.mode||e(this.form,"workingSpeed")||(t=!1),2!==this.currentStep&&"full"!==this.mode||e(this.form,"fieldEfficiency")||(t=!1),t}nextPrev(t,e){if(e&&e.preventDefault(),"full"===this.mode){if(!this.validateForm())return!1}else if(1==t&&!this.validateForm())return!1;if("step"===this.mode&&(this.cache.sections[this.currentStep].style.display="none"),this.currentStep=this.currentStep+t,this.currentStep>=this.cache.sections.length)return this.submitted=!0,this.showResults.call(this),!1;this.showTab.call(this,this.currentStep)}showResults(){let t=parseFloat(this.form.querySelector('[name="implementWidth"').value),e=parseFloat(this.form.querySelector('[name="workingSpeed"').value),a=i(parseFloat(this.form.querySelector('[name="fieldEfficiency"').value)/100,2),s=i(100*a,0),n=i(8.25,2),c=i(e*t*a/n,2),r=i(10*c,2),d={socket:this.socket,tract:this.tract,units:this.units,implementWidth:t,workingSpeed:e,fieldEfficiency:a,fieldEfficiencyPercent:s,fieldCapacity:r,fieldCapacityPerHour:c};this.socket&&this.agcCalculated.emit({socket:this.socket,tract:this.tract,results:Object.assign({},d)}),this.results=Object.assign({},d),this.cache.results.forEach(t=>{t.style.display="block"})}handleAction(t){"reset"===t.detail.action&&this.reset()}componentDidLoad(){var t=Array.from(this.form.querySelectorAll("[data-wizard-section]")).map(t=>t).map(t=>t),e=Array.from(this.form.querySelectorAll("[data-wizard-results]")).map(t=>t).map(t=>t);this.cache=Object.assign({},this.cache,{sections:t,results:e}),window.document.addEventListener("agcAction",this.handleAction.bind(this)),this.form.querySelector('[name="fieldEfficiency"').value="83",this.showTab(0)}componentDidUnload(){window.document.removeEventListener("agcAction",this.handleAction)}static get is(){return"agc-field-capacity"}static get properties(){return{cache:{state:!0},currentStep:{state:!0},mode:{type:String,attr:"mode"},results:{state:!0},socket:{type:String,attr:"socket"},submitted:{state:!0},tract:{type:String,attr:"tract"},units:{type:"Any",attr:"units"}}}static get events(){return[{name:"agcCalculated",method:"agcCalculated",bubbles:!0,cancelable:!0,composed:!0},{name:"agcStepChanged",method:"agcStepChanged",bubbles:!0,cancelable:!0,composed:!0}]}}export{a as AgcFieldCapacity};