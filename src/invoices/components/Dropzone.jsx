import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from "@material-ui/core/Typography";
import EditIcon from '@material-ui/icons/Edit';
import {API, API_URL} from '../../config';
import pulse from '../../pulse';

class DropzoneAreaExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            originalFiles: [],
            toUpload: [],
            uploading: false,
            hasFiles: true,
            open: false,
            replace: '',
            originalID: this.props.originalID
        };
    }

    componentDidMount() {
        const {files, originalFiles} = this.props;
        this.setState({files});
        this.setState({originalFiles});

        if (this.state.files.length <= 0) {
            this.setState({
                hasFiles: false
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.filesLength !== undefined) {
            this.props.filesLength(this.state.files.length);
        }
    }

    handleChange(files) {
        this.setState({
            toUpload: files
        });
    }

    fileUpload(files, fromSingleField = false) {

        let source_id = '';

        if (fromSingleField) {
            files = files.target.files[0];

            if (this.state.replace) {
                const id = this.state.replace;
                this.handleRemove(id, true);
            }
            source_id = this.state.originalID ? this.state.originalID : this.props.source_id;
        }

        this.setState({uploading: true});

        const data = new FormData();
        data.append('file', files);
        data.append('type', this.props.type);
        data.append('source_id', source_id || this.props.source_id);
        data.append('source', this.props.source);

        try {
            fetch(API_URL + '/fileupload', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage["appState"]).user.auth_token}`,
                },
                body: data
            })
                .then(response => response.json())
                .then(data => {

                    if (!fromSingleField) {

                        this.setState(prevState => ({
                            files: [
                                ...prevState.files,
                                {
                                    id: data.id,
                                    original_name: data.original_name,
                                    filename: data.filename,
                                    type: this.props.type
                                }
                            ]
                        }));
                    } else {

                        const removeFromStateID = this.state.replace;

                        this.setState({
                            originalFiles:
                                this.state.originalFiles.filter(function (file) {
                                    return file.id !== removeFromStateID
                                })

                        });

                        setTimeout(() => {
                            this.setState(prevState => ({
                                originalFiles: [
                                    ...prevState.originalFiles,
                                    {
                                        id: data.id,
                                        original_name: data.original_name,
                                        filename: data.filename,
                                        type: this.props.type
                                    }
                                ]
                            }));
                        }, 0);
                    }

                    this.setState({uploading: false, replace: ''})
                });
        } catch (err) {
            console.error(err);
        }

    }

    async handleRemove(id, confirmed = false) {
        let confirmThis = confirmed === true ? confirmed : window.confirm("Potwierdź usunięcie pliku");
        if (confirmThis) {
            this.setState({
                toUpload: []
            });
            // remove file
            await pulse.files.deleteFile({
                id: id
            }).then(
                res => {
                    const files = this.state.files.filter(function (file) {
                        return file.id !== res.id;
                    });
                    this.setState({files})
                }
            );
        }
    }

    async setForReplace(id) {
        this.setState({
            replace: id
        });
        this.refs.fileUploader.click();
    }

    render() {
        const {files, hasFiles, originalFiles} = this.state;
        const {uploading} = this.state;

        return (
            <div className={'dropZoneWrapper'}>
                <DropzoneArea
                    // onChange={this.handleChange.bind(this)}
                    // open={this.state.open}
                    onDrop={(e) => this.fileUpload(e)}
                    dropzoneText={pulse.text.move_files}
                    showPreviewsInDropzone={false}
                    showPreviews={false}
                    maxFileSize={9999999}
                    filesLimit={20}
                    showAlerts={true}
                    showFileNamesInPreview={true}
                    acceptedFiles={['image/*', 'video/*', 'application/*', 'text/*', 'html/*', 'message/rfc822', 'application/vnd.ms-outlook', 'application/octet-stream', 'message/msoutlook', 'message/*', '']}
                />

                <input onChange={(e) => this.fileUpload(e, true)} type="file" id="file" ref="fileUploader"
                       style={{display: "none"}}/>

                {uploading && <div style={{padding: 10}}><LinearProgress/> <br/> {pulse.text.loading}...</div>}

                {files.length > 0 &&
                <React.Fragment>
                    <Typography style={{marginTop: 20, fontSize: 16}} variant="h6" gutterBottom>
                        {pulse.text.file_list}:
                    </Typography>
                    <List dense={true}>
                        {files.map(file => {
                            if (file.type === this.props.type) {
                                return (
                                    <ListItem key={file.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FolderIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Link href={API + file.filename} target="_blank">
                                            <ListItemText
                                                primary={file.original_name}
                                                secondary={file.updated_at}
                                            />
                                        </Link>
                                        <ListItemSecondaryAction>
                                            {/*<Tooltip title={pulse.text.replace_file}>*/}
                                            {/*    <Button*/}
                                            {/*        onClick={this.setForReplace.bind(this, file.id)}*/}
                                            {/*        size="small"*/}
                                            {/*        variant="text"*/}
                                            {/*        color="inherit"*/}
                                            {/*    >*/}
                                            {/*        <EditIcon/>*/}
                                            {/*    </Button>*/}
                                            {/*</Tooltip>*/}
                                            <Tooltip title={pulse.text.delete_file}>
                                                <Button
                                                    onClick={this.handleRemove.bind(this, file.id)}
                                                    size="small"
                                                    variant="text"
                                                    color="secondary"
                                                >
                                                    <DeleteIcon/>
                                                </Button>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            }
                            return '';
                        })}
                    </List>
                </React.Fragment>
                }
                {originalFiles && (
                    <React.Fragment>
                        {originalFiles.length > 0 && (
                            <React.Fragment>
                                <Paper style={{padding: '10px 20px', marginTop: 30}}>
                                    <Typography variant="h6" style={{fontSize: 16}} gutterBottom>
                                        {pulse.text.file_list_original}:
                                    </Typography>
                                    <List dense={true}>
                                        {originalFiles.map(file => {
                                            if (file.type === this.props.type) {
                                                return (
                                                    <ListItem key={file.id}>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <FolderIcon/>
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <Link href={API + file.filename} target="_blank">
                                                            <ListItemText
                                                                primary={file.original_name}
                                                                secondary={file.updated_at}
                                                            />
                                                        </Link>
                                                        <ListItemSecondaryAction>
                                                            <Tooltip title={pulse.text.replace_file}>
                                                                <Button
                                                                    onClick={this.setForReplace.bind(this, file.id)}
                                                                    size="small"
                                                                    variant="text"
                                                                    color="inherit"
                                                                >
                                                                    <EditIcon/>
                                                                </Button>
                                                            </Tooltip>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )
                                            }
                                            return '';
                                        })}
                                    </List>
                                </Paper>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}

            </div>
        )
    }
}

export default DropzoneAreaExample;

