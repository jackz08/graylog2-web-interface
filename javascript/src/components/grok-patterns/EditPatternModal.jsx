'use strict';

var $ = require('jquery'); // excluded and shimed

var React = require('react/addons');
var BootstrapModal = require('../bootstrap/BootstrapModal');
var URLUtils = require("../../util/URLUtils");


var EditDashboardModal = React.createClass({
    getInitialState() {
        return {
            id: this.props.id,
            name: this.props.name,
            pattern: this.props.pattern
        };
    },
    _onPatternChange(event) {
        this.setState({pattern: event.target.value});
    },
    _onNameChange(event) {
        this.setState({name: event.target.value});
    },
    render() {
        var header = <h2>{this.props.id === "" ? "Create" : "Edit"} Grok Pattern {this.props.name}</h2>;
        var body = (
            <fieldset>
                <label>Name:</label>
                <input type="text" onChange={this._onNameChange} value={this.state.name} required/>
                <label>Pattern:</label>
                <input type="text" onChange={this._onPatternChange} value={this.state.pattern}  required/>
            </fieldset>
        );
        return (
            <span>
                <button onClick={this.openModal} className="btn btn-mini">
                    <i className="icon-edit"></i> {this.props.id === "" ? "Create" : "Edit"}
                </button>
                <BootstrapModal ref="modal" onCancel={this._closeModal} onConfirm={this._save} cancel="Cancel" confirm="Save">
                   {header}
                   {body}
                </BootstrapModal>
            </span>
        );
    },
    _closeModal() {
        this.refs.modal.close();
    },
    openModal() {
        this.refs.modal.open();
    },
    _save() {
        var pattern = this.state;
        var url;
        if (this.props.id === "") {
            url = URLUtils.appPrefixed('/a/system/grokpatterns/create');
        } else {
            url = URLUtils.appPrefixed('/a/system/grokpatterns/update');
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: url,
            data: JSON.stringify(pattern)
        }).done(() => {
            this._closeModal();
            this.props.reload();
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.log("could not update pattern " + pattern + ": " + errorThrown);
        });
    }
});

module.exports = EditDashboardModal;