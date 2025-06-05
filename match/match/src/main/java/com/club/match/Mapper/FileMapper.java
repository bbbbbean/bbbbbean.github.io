package com.club.match.Mapper;


import com.club.match.Domain.DTO.AttachmentFileDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {
    int uploadFile(AttachmentFileDTO attachmentFileDTO);

    int deleteFile(Long postAttachmentId);

    int deleteTempFileList(String userId);

    AttachmentFileDTO selectAt(Long postAttachmentId);

    List<AttachmentFileDTO> selectFilesByPostId(Long postId);

    List<AttachmentFileDTO> selectFileList(String userId);

    List<String> selectTempFile(Long postId);

    int updatePostAttachment(Long postId, String attachmentUrl);

    int updatePostAttachmentUrl(String newAttachmentUrl,Long postId, String oldAttachmentUrl);

    int updatePostIdAndUrl(AttachmentFileDTO attachmentFileDTO);

    String chatFileDownload(String fileName);
}