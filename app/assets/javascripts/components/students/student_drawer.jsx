import React from 'react';
import Expandable from '../high_order/expandable.jsx';
import RevisionStore from '../../stores/revision_store.js';
import TrainingStatusStore from '../../stores/training_status_store.js';
import TrainingStatus from './training_status.jsx';
import DiffViewer from '../revisions/diff_viewer.jsx';

const getRevisions = studentId => RevisionStore.getFiltered({ user_id: studentId });
const getTrainingStatus = () => TrainingStatusStore.getModels();

const StudentDrawer = React.createClass({
  displayName: 'StudentDrawer',

  propTypes: {
    student: React.PropTypes.object,
    is_open: React.PropTypes.bool
  },

  mixins: [RevisionStore.mixin, TrainingStatusStore.mixin],

  getInitialState() {
    return {
      revisions: getRevisions(this.props.student.id),
      trainingModules: getTrainingStatus()
    };
  },

  getKey() {
    return `drawer_${this.props.student.id}`;
  },

  storeDidChange() {
    return this.setState({
      revisions: getRevisions(this.props.student.id),
      trainingModules: getTrainingStatus()
    });
  },

  render() {
    if (!this.props.is_open) { return <tr></tr>; }

    const revisionsRows = (this.state.revisions || []).map((rev) => {
      const details = I18n.t('users.revision_characters_and_views', { characters: rev.characters, views: rev.views });
      return (
        <tr key={rev.id}>
          <td>
            <p className="name">
              <a href={rev.article.url} target="_blank">{rev.article.title}</a>
              <br />
              <small className="tablet-only-ib">{details}</small>
            </p>
          </td>
          <td className="desktop-only-tc date"><a href={rev.url} target="_blank">{moment(rev.date).format('YYYY-MM-DD   h:mm A')}</a></td>
          <td className="desktop-only-tc">{rev.characters}</td>
          <td className="desktop-only-tc">{rev.views}</td>
          <td className="desktop-only-tc">
            <DiffViewer revision={rev}
                        charCount={rev.characters}
            />
          </td>
        </tr>
      );
    });

    if (this.props.is_open && revisionsRows.length === 0) {
      revisionsRows.push(
        <tr key={`${this.props.student.id}-no-revisions`}>
          <td colSpan="7" className="text-center">
            <p>{I18n.t('users.no_revisions')}</p>
          </td>
        </tr>
      );
    }

    revisionsRows.push(
      <tr key={`${this.props.student.id}-contribs`}>
        <td colSpan="7" className="text-center">
          <p><a href={this.props.student.contribution_url} target="_blank">{I18n.t('users.contributions_history_full')}</a></p>
        </td>
      </tr>
    );

    let className = 'drawer';
    className += !this.props.is_open ? ' closed' : '';

    return (
      <tr className={className}>
        <td colSpan="7">
          <TrainingStatus trainingModules={this.state.trainingModules} />
          <table className="table">
            <thead>
              <tr>
                <th>{I18n.t('users.contributions')}</th>
                <th className="desktop-only-tc">{I18n.t('metrics.date_time')}</th>
                <th className="desktop-only-tc">{I18n.t('metrics.char_added')}</th>
                <th className="desktop-only-tc">{I18n.t('metrics.view')}</th>
                <th className="desktop-only-tc"></th>
              </tr>
            </thead>
            <tbody>{revisionsRows}</tbody>
          </table>
        </td>
      </tr>
    );
  }
}
);

export default Expandable(StudentDrawer);
