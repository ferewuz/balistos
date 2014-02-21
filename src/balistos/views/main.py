# -*- coding: utf-8 -*-
"""Main views on front page"""

from balistos.models.clip import Clip
from balistos.models.clip import PlaylistClip
from balistos.models.playlist import Playlist
from balistos.playlist import add_playlist_clip
from balistos.playlist import get_playlist_videos
from balistos.playlist import remove_playlist_clip
from balistos.static import balistos_assets
from balistos.static import youtube_assets
from pyramid.httpexceptions import HTTPNotFound
from pyramid.response import Response
from pyramid.security import authenticated_userid
from pyramid.view import view_config


import json
import isodate


@view_config(
    route_name='home',
    renderer='balistos:templates/home.pt',
    layout='default',
)
def home(request):
    """The home page."""
    balistos_assets.need()
    return {
        'name': 'balistos',
    }


@view_config(
    route_name='main',
    renderer='balistos:templates/main.pt',
    layout='default',
)
def main(request):
    """Main page view"""
    balistos_assets.need()
    youtube_assets.need()
    session = request.session
    if not 'playlist' in session or not session['playlist']:
        session['playlist'] = str(Playlist.get_all()[0].uri)
    return {}


@view_config(
    route_name='playlist_videos',
)
def playlist_videos(request):
    """
    View that returns videos of our playlist in json format

    :param    request: current request
    :type     request: pyramid.request.Request

    :returns: json listing all videos as http response
    :rtype:   pyramid.response.Response
    """
    if not request.is_xhr:
        return HTTPNotFound()
    playlist = Playlist.get(request.session['playlist'])
    username = authenticated_userid(request)
    pclips = get_playlist_videos(playlist, username=username)
    return Response(body=json.dumps(pclips), content_type='application/json')


@view_config(
    route_name='set_playlist',
    renderer='balistos:templates/main.pt',
    layout='default',
)
def set_playlist(request):
    """
    View that sets playlist in our session

    :param    request: current request
    :type     request: pyramid.request.Request

    :returns: nothing, just renders template
    :rtype:   empty dict
    """

    balistos_assets.need()
    youtube_assets.need()
    session = request.session
    session['playlist'] = request.matchdict.get('playlist')
    return {}


@view_config(
    route_name='playlist_add_video',
)
def playlist_add_video(request):
    """
    View that adds video to playlist currently in session and returns
    changed playlist videos list

    :param    request: current request
    :type     request: pyramid.request.Request

    :returns: dict for each clip that is part of playlist
    :rtype:   list of dicts
    """
    if not request.is_xhr:
        return HTTPNotFound()
    title = request.GET['title']
    image_url = request.GET['image']
    youtube_video_id = request.GET['id']
    duration = isodate.parse_duration(request.GET['duration']).total_seconds()
    playlist = Playlist.get(request.session['playlist'])
    add_playlist_clip(playlist, title, image_url, youtube_video_id, duration)
    pclips = get_playlist_videos(playlist)
    return Response(body=json.dumps(pclips), content_type='application/json')


@view_config(
    route_name='like_video',
)
def like_video(request):
    """
    Like/unlike a selected video but only if user is logged in
    and didn't like/unlike it yet

    :param    request: current request
    :type     request: pyramid.request.Request

    :returns: empty response
    :rtype:   pyramid.response.Response
    """
    if not request.is_xhr:
        return HTTPNotFound()
    username = authenticated_userid(request)
    if not username:
        return Response()
    like = int(request.GET['like'])
    youtube_video_id = request.GET['video_id']
    playlist = Playlist.get(request.session['playlist'])
    pclip = PlaylistClip.get_by_playlist_and_clip(
        playlist,
        Clip.get(youtube_video_id)
    )
    pclip.likes += like
    return Response()


@view_config(
    route_name='remove_video'
)
def remove_video(request):
    """
    Remove video from playlist if you have correct rights

    :param    request: current request
    :type     request: pyramid.request.Request

    :returns: success if video was remove correctly, error otherwise
    :rtype:   pyramid.response.Response
    """
    if not request.is_xhr:
        return HTTPNotFound()
    username = authenticated_userid(request)
    youtube_video_id = request.GET['video_id']
    playlist = Playlist.get(request.session['playlist'])
    if not username or not youtube_video_id:
        return Response(
            body=json.dumps({'error': ''}),
            content_type='application/json'
        )

    if not remove_playlist_clip(playlist, youtube_video_id):
        return Response(
            body=json.dumps({'error': ''}),
            content_type='application/json'
        )

    return Response(
        body=json.dumps({'success': 'Succesfully removed'}),
        content_type='application/json'
    )
