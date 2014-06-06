Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [
    ],
    
    launch: function() {
        Ext.create('Rally.data.wsapi.Store', {
            model: 'User',
            autoLoad: true,
            filters: [
                {
                    property: 'TeamMemberships',
                    operator: 'contains',
                    value: Rally.util.Ref.getRelativeUri(this.getContext().getProject())
                }
            ],
            listeners: {
                load: this._onTeamMembersLoaded,
                scope: this
            }
        }); 
    },

    _onTeamMembersLoaded: function(store, records) {
        var columns = [
            {
                value: null,
                columnHeaderConfig: {
                    headerData: {owner: 'No Owner'}
                }
            }
        ];

        _.each(records, function(record) {
            columns.push({
                value: record.getRef().getRelativeUri(),
                columnHeaderConfig: {
                    headerData: {owner: record.get('_refObjectName')}
                }
            });
        });

        this._addBoard(columns);
    },

    _addBoard: function(columns) {
        this.add({
            xtype: 'rallycardboard',
            types: ['User Story'],
            attribute: 'Owner',
            context: this.getContext(),
            columnConfig: {
                columnHeaderConfig: {
                    headerTpl: '{owner}'
                }
            },
            columns: columns
        });
    }
    
});
